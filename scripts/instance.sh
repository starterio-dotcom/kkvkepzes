#!/usr/bin/env bash
#
# Több független Moodle-példány kezelése EGY docker-compose.yml-ből.
#
# Példány-modell:
#   a  -> projekt "kkvkepzes",   env ".env",    kód "./moodle"    (8080)  [alap]
#   b  -> projekt "kkvkepzes_b", env ".env.b",  kód "./moodle-b"  (8081)
#   c  -> projekt "kkvkepzes_c", env ".env.c",  kód "./moodle-c"  (8082)  ...
#
# Használat:
#   scripts/instance.sh up b|down b|ps b|logs b
#   scripts/instance.sh install b                 # friss Moodle-telepítés (LASSÚ ~30-40p)
#   scripts/instance.sh restore b [backups/course-3.mbz]
#   scripts/instance.sh bootstrap-fresh b [v5.2.1] # klón forrás + up + install (+ kézzel restore)
#   scripts/instance.sh bootstrap-clone b a        # 'a' TARTALMÁNAK gyors másolása 'b'-be (~perc)
#
set -euo pipefail
export MSYS_NO_PATHCONV=1          # Git Bash: ne írja át a /var/... útvonalakat
cd "$(dirname "$0")/.."            # projektgyökér

proj(){ [ "$1" = a ] && echo kkvkepzes || echo "kkvkepzes_$1"; }
envf(){ [ "$1" = a ] && echo .env    || echo ".env.$1"; }
srcd(){ [ "$1" = a ] && echo ./moodle || echo "./moodle-$1"; }
dc(){ local i="$1"; shift; docker compose -p "$(proj "$i")" --env-file "$(envf "$i")" "$@"; }

# adott példány env-változóinak beolvasása (wwwroot, DB creds…)
loadenv(){ set -a; . "$(envf "$1")"; set +a; }

install_moodle(){          # $1 = példány
  local i="$1"; loadenv "$i"
  dc "$i" exec -u root moodle bash -c 'chown -R www-data:www-data /var/www/moodledata && chmod 2775 /var/www/moodledata'
  dc "$i" exec -u www-data moodle php admin/cli/install.php \
    --lang=en --wwwroot="$MOODLE_WWWROOT" --dataroot=/var/www/moodledata \
    --dbtype=mariadb --dbhost=db --dbname="$DB_NAME" --dbuser="$DB_USER" --dbpass="$DB_PASSWORD" --dbport=3306 \
    --prefix=mdl_ --fullname="KKV Kepzes ($i)" --shortname="kkv_$i" \
    --adminuser="$MOODLE_ADMIN_USER" --adminpass="$MOODLE_ADMIN_PASS" --adminemail="$MOODLE_ADMIN_EMAIL" \
    --non-interactive --agree-license
}

restore_mbz(){             # $1 = példány, $2 = mbz a hoston (default: backups/course-3.mbz)
  local i="$1"; local mbz="${2:-backups/course-3.mbz}"
  dc "$i" exec -u www-data moodle php admin/cli/restore_backup.php --file="/backups/$(basename "$mbz")" --categoryid=1
}

clone_source(){            # $1 = példány, $2 = git tag/branch (default v5.2.1)
  local i="$1"; local tag="${2:-v5.2.1}"; local dir; dir="$(srcd "$i")"
  [ -d "$dir/.git" ] && { echo "[$i] forrás már megvan: $dir"; return; }
  echo "[$i] Moodle forrás klónozása ($tag) -> $dir"
  git clone --branch "$tag" --depth 1 https://github.com/moodle/moodle.git "$dir"
}

case "${1:-}" in
  up)      dc "$2" up -d ;;
  down)    dc "$2" down ;;
  ps)      dc "$2" ps ;;
  logs)    dc "$2" logs -f moodle ;;
  install) install_moodle "$2" ;;
  restore) restore_mbz "$2" "${3:-}" ;;

  bootstrap-fresh)                       # teljesen új példány friss telepítéssel
    i="$2"; tag="${3:-v5.2.1}"
    clone_source "$i" "$tag"
    dc "$i" up -d
    echo "[$i] várakozás a DB-re…"; until dc "$i" exec -T db healthcheck.sh --connect --innodb_initialized >/dev/null 2>&1; do sleep 2; done
    install_moodle "$i"
    echo "[$i] KÉSZ. Restore kézzel: scripts/instance.sh restore $i"
    ;;

  bootstrap-clone)                       # $2 cél, $3 forrás – TARTALOM-másolás (azonos verzió!)
    dst="$2"; src="$3"
    clone_source "$dst" "$(cd "$(srcd "$src")" && git describe --tags 2>/dev/null || echo v5.2.1)"
    dc "$dst" up -d db
    echo "[$dst] várakozás a DB-re…"; until dc "$dst" exec -T db healthcheck.sh --connect --innodb_initialized >/dev/null 2>&1; do sleep 2; done
    ( set -a; . "$(envf "$src")"; RP=$DB_ROOT_PASSWORD; set +a
      echo "[$dst] DB átmásolása $src -> $dst"
      dc "$src" exec -T db mariadb-dump -uroot -p"$RP" --single-transaction --routines moodle \
        | dc "$dst" exec -T db mariadb -uroot -p"$RP" moodle )
    echo "[$dst] moodledata másolása"
    docker run --rm -v "$(proj "$src")_moodledata":/from -v "$(proj "$dst")_moodledata":/to alpine \
      sh -c 'cd /from && cp -a . /to/'
    echo "[$dst] config.php a cél wwwroot-tal"
    loadenv "$dst"
    cp "$(srcd "$src")/config.php" "$(srcd "$dst")/config.php"
    # wwwroot átírása a cél portra
    sed -i "s#\$CFG->wwwroot.*#\$CFG->wwwroot   = '$MOODLE_WWWROOT';#" "$(srcd "$dst")/config.php"
    dc "$dst" up -d
    dc "$dst" exec -u www-data moodle php admin/cli/purge_caches.php
    echo "[$dst] KÉSZ – független másolat a(z) $MOODLE_WWWROOT címen."
    ;;

  *) echo "Ismeretlen parancs. Lásd a fejlécet."; exit 1 ;;
esac
