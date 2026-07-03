/* @ds-bundle: {"format":3,"namespace":"DPDesignSystem_019e2b","components":[],"sourceHashes":{"ui_kits/citizen-portal/components.jsx":"50a1362ec6a7","ui_kits/citizen-portal/screens.jsx":"84cc05795c67","ui_kits/mobile-app/ios-frame.jsx":"d67eb3ffe562","ui_kits/mobile-app/screens.jsx":"7b376a2cb2d3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DPDesignSystem_019e2b = window.DPDesignSystem_019e2b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/citizen-portal/components.jsx
try { (() => {
// DÁP citizen portal — shared components used across screens.
// Loaded as a Babel JSX script. Exports components to window.

const Brand = ({
  inverted,
  compact
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: inverted ? "#fff" : "var(--brand)"
  }
}, /*#__PURE__*/React.createElement("svg", {
  width: "34",
  height: "27",
  viewBox: "0 0 85 68",
  xmlns: "http://www.w3.org/2000/svg",
  style: {
    flex: "0 0 auto"
  }
}, /*#__PURE__*/React.createElement("path", {
  d: "M 13.144 21.203 C 18.889 19.84 22.446 14.054 21.09 8.279 C 19.735 2.503 13.979 -1.073 8.234 0.29 C 2.49 1.653 -1.068 7.439 0.288 13.215 C 1.644 18.99 7.4 22.567 13.144 21.203 Z",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("path", {
  d: "M 0.003 34.524 C 0.003 28.588 4.789 23.781 10.688 23.78 C 16.592 23.781 21.373 28.593 21.373 34.524 L 21.373 67.992 L 0.003 67.992 L 0.003 34.524 Z",
  fill: "currentColor"
}), /*#__PURE__*/React.createElement("path", {
  d: "M 25.797 0.096 L 50.826 0.096 C 69.499 0.096 84.637 15.319 84.637 34.093 C 84.637 52.866 69.499 68.085 50.826 68.085 L 25.797 68.085 L 25.797 0.096 Z M 47.162 44.832 L 51.701 44.832 C 57.606 44.837 62.388 40.029 62.388 34.093 C 62.388 28.156 57.601 23.349 51.701 23.349 L 47.162 23.349 L 47.162 44.832 Z",
  fill: "currentColor",
  fillRule: "evenodd"
})), !compact && /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.05,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "-0.01em"
  }
}, /*#__PURE__*/React.createElement("span", null, "Digit\xE1lis"), /*#__PURE__*/React.createElement("span", null, "\xC1llampolg\xE1rs\xE1g"), /*#__PURE__*/React.createElement("span", null, "Program")));
const OfficialBanner = () => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--indigo-1100)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 500,
    padding: "8px 24px",
    display: "flex",
    alignItems: "center",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-shield-check-fill",
  style: {
    fontSize: 16
  }
}), /*#__PURE__*/React.createElement("span", null, "Magyarorsz\xE1g hivatalos weboldala."), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-down-s-line",
  style: {
    marginLeft: "auto",
    fontSize: 18
  }
}));
const Btn = ({
  kind = "primary",
  size = "md",
  icon,
  iconRight,
  children,
  onClick,
  full
}) => {
  const heights = {
    sm: 32,
    md: 40,
    lg: 48
  };
  const pads = {
    sm: "0 12px",
    md: "0 18px",
    lg: "0 24px"
  };
  const fonts = {
    sm: 14,
    md: 16,
    lg: 18
  };
  const styles = {
    primary: {
      background: "var(--brand)",
      color: "#fff"
    },
    outline: {
      background: "#fff",
      color: "var(--brand)",
      boxShadow: "inset 0 0 0 2px var(--brand)"
    },
    subtle: {
      background: "var(--indigo-200)",
      color: "var(--brand)"
    },
    quiet: {
      background: "transparent",
      color: "var(--neutral-fg-primary)"
    },
    quietWhite: {
      background: "transparent",
      color: "#fff"
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...styles[kind],
      height: heights[size],
      padding: pads[size],
      fontSize: fonts[size],
      fontWeight: 700,
      border: "none",
      borderRadius: 9999,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      lineHeight: 1,
      width: full ? "100%" : "auto",
      justifyContent: "center",
      fontFamily: "var(--font-primary)"
    }
  }, icon && /*#__PURE__*/React.createElement("i", {
    className: icon,
    style: {
      fontSize: fonts[size] + 2
    }
  }), children, iconRight && /*#__PURE__*/React.createElement("i", {
    className: iconRight,
    style: {
      fontSize: fonts[size] + 2
    }
  }));
};
const TextField = ({
  icon,
  placeholder,
  value,
  onChange,
  label,
  type = "text"
}) => /*#__PURE__*/React.createElement("label", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    width: "100%"
  }
}, label && /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--neutral-fg-primary)"
  }
}, label), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#fff",
    border: "2px solid var(--cold-grey-400)",
    borderRadius: 8,
    padding: "0 14px",
    height: 44
  }
}, icon && /*#__PURE__*/React.createElement("i", {
  className: icon,
  style: {
    color: "var(--neutral-fg-tertiary)",
    fontSize: 20
  }
}), /*#__PURE__*/React.createElement("input", {
  type: type,
  value: value,
  onChange: onChange,
  placeholder: placeholder,
  style: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "var(--font-primary)",
    color: "var(--neutral-fg-primary)"
  }
})));
const SearchHero = ({
  value,
  onChange,
  onSubmit,
  badges
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    alignItems: "stretch",
    flexWrap: "wrap"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    minWidth: 320,
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    borderRadius: 9999,
    padding: "0 6px 0 24px",
    height: 56,
    boxShadow: "0 4px 24px rgba(8,12,40,0.18)"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-search-line",
  style: {
    fontSize: 22,
    color: "var(--neutral-fg-tertiary)"
  }
}), /*#__PURE__*/React.createElement("input", {
  value: value,
  onChange: onChange,
  placeholder: "Keres\xE9s a szolg\xE1ltat\xE1sok k\xF6z\xF6tt",
  style: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 18,
    fontWeight: 500,
    fontFamily: "var(--font-primary)"
  }
}), /*#__PURE__*/React.createElement(Btn, {
  kind: "primary",
  size: "md",
  onClick: onSubmit
}, "Keres\xE9s")));
const TopicCard = ({
  icon,
  title,
  desc,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    textAlign: "left",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    minHeight: 180,
    fontFamily: "var(--font-primary)"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    background: "var(--indigo-200)",
    color: "var(--brand)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24
  }
}, /*#__PURE__*/React.createElement("i", {
  className: icon
})), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--neutral-fg-primary)"
  }
}, title), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: 500,
    color: "var(--neutral-fg-secondary)",
    lineHeight: 1.5
  }
}, desc), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    color: "var(--brand)",
    marginTop: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 4
  }
}, "R\xE9szletek ", /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-line"
})));
const Header = ({
  active = "Szolgáltatások",
  onNav
}) => {
  const items = ["Életesemények", "Szolgáltatások", "Hírek", "Súgó"];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      background: "#fff",
      borderBottom: "1px solid var(--neutral-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "0 24px",
      height: 72,
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4,
      marginLeft: 24
    }
  }, items.map(label => {
    const isActive = label === active;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      onClick: () => onNav?.(label),
      style: {
        background: isActive ? "var(--indigo-200)" : "transparent",
        color: isActive ? "var(--brand)" : "var(--neutral-fg-primary)",
        border: "none",
        padding: "10px 16px",
        borderRadius: 9999,
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 14,
        fontFamily: "var(--font-primary)"
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    kind: "quiet",
    size: "md",
    icon: "ri-global-line"
  }, "HU"), /*#__PURE__*/React.createElement(Btn, {
    kind: "outline",
    size: "md",
    icon: "ri-user-line"
  }, "Bel\xE9p\xE9s"))));
};
const Footer = () => /*#__PURE__*/React.createElement("footer", {
  style: {
    background: "var(--cold-grey-1500)",
    color: "#fff",
    padding: "48px 24px 24px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1fr",
    gap: 32
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
}, /*#__PURE__*/React.createElement(Brand, {
  inverted: true
}), /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    maxWidth: 360,
    lineHeight: 1.6
  }
}, "Az \xE1llam veled van. Egyszer\u0171, gyors \xE9s biztons\xE1gos elektronikus \xFCgyint\xE9z\xE9s.")), [{
  title: "Szolgáltatások",
  links: ["Életesemények", "Adatlapok", "Időpontfoglalás", "Nyomtatványok"]
}, {
  title: "Tájékoztatás",
  links: ["GYIK", "Hírek", "Sajtó", "Akadálymentesítés"]
}, {
  title: "Kapcsolat",
  links: ["Ügyfélszolgálat: 1818", "Kormányablakok", "Adatvédelem", "Impresszum"]
}].map(col => /*#__PURE__*/React.createElement("div", {
  key: col.title,
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  }
}, col.title), col.links.map(l => /*#__PURE__*/React.createElement("a", {
  key: l,
  href: "#",
  style: {
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    textDecoration: "none"
  }
}, l))))), /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "32px auto 0",
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)"
  }
}, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Digit\xE1lis \xC1llampolg\xE1rs\xE1g Program \xB7 Magyarorsz\xE1g Korm\xE1nya"), /*#__PURE__*/React.createElement("span", null, "v1.3.0")));
const Callout = ({
  kind = "info",
  title,
  children
}) => {
  const map = {
    info: {
      bg: "var(--semantic-blue-200)",
      fg: "var(--semantic-blue-1200)",
      icon: "ri-information-fill"
    },
    positive: {
      bg: "var(--semantic-green-200)",
      fg: "var(--semantic-green-1000)",
      icon: "ri-checkbox-circle-fill"
    },
    warning: {
      bg: "var(--semantic-orange-200)",
      fg: "var(--semantic-orange-1100)",
      icon: "ri-alert-fill"
    },
    negative: {
      bg: "var(--semantic-red-200)",
      fg: "var(--semantic-red-1100)",
      icon: "ri-error-warning-fill"
    }
  };
  const c = map[kind];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: c.bg,
      color: c.fg,
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: c.icon,
    style: {
      fontSize: 22
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1.5
    }
  }, title && /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 700,
      marginRight: 6
    }
  }, title), children));
};
Object.assign(window, {
  Brand,
  OfficialBanner,
  Btn,
  TextField,
  SearchHero,
  TopicCard,
  Header,
  Footer,
  Callout
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/citizen-portal/components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/citizen-portal/screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DÁP citizen portal — page screens. Loaded after components.jsx.

const TOPICS = [{
  id: "moving",
  icon: "ri-truck-line",
  title: "Költözés",
  desc: "Lakcímváltozás bejelentése, közüzemi átírások és adminisztráció egy helyen."
}, {
  id: "marriage",
  icon: "ri-hearts-line",
  title: "Házasságkötés és válás",
  desc: "Anyakönyvi ügyek, kapcsolati állapot változása, gyámsági kérdések."
}, {
  id: "car",
  icon: "ri-car-line",
  title: "Gépjármű vásárlás",
  desc: "Forgalomba helyezés, biztosítás, jogosítvány és gépjárműadó ügyintézés."
}, {
  id: "child",
  icon: "ri-parent-line",
  title: "Gyermek születése",
  desc: "Születési anyakönyvi kivonat, csok+, családi pótlék és gyermekjogosultságok."
}, {
  id: "passport",
  icon: "ri-shield-user-line",
  title: "Útlevél igénylés",
  desc: "Új útlevél, megújítás, gyorsított eljárás és időpontfoglalás."
}, {
  id: "tax",
  icon: "ri-bank-card-line",
  title: "Adóügyek",
  desc: "Személyi jövedelemadó bevallás, befizetés és igazolás letöltése."
}];
const NEWS = [{
  tag: "Hír",
  date: "2026. 04. 12.",
  title: "Mostantól mobilon is intézhető az útlevél megújítása",
  desc: "Az alkalmazás új verziója a teljes folyamatot végigvezeti."
}, {
  tag: "Karbantartás",
  date: "2026. 04. 09.",
  title: "Tervezett karbantartás április 14-én",
  desc: "Hajnali 2 és 4 óra között a Magyarorszag.hu szolgáltatás szünetel."
}, {
  tag: "Tájékoztató",
  date: "2026. 04. 03.",
  title: "Megújult ügyfélkapu+ azonosítás",
  desc: "Egyszerűbb belépés, erősebb biztonság — minden részlet itt."
}];

// ---------------------------------------------------------------- Home
const HomePage = ({
  goTo,
  setQuery,
  query
}) => /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
  style: {
    background: "var(--brand)",
    color: "#fff",
    padding: "72px 24px 96px",
    backgroundImage: "radial-gradient(at 80% 20%, var(--indigo-800) 0%, transparent 50%), radial-gradient(at 10% 90%, var(--indigo-1200) 0%, transparent 60%)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: 700,
    opacity: 0.8,
    letterSpacing: "0.04em",
    textTransform: "uppercase"
  }
}, "Magyarorszag.hu"), /*#__PURE__*/React.createElement("h1", {
  style: {
    font: "var(--type-h1)",
    fontSize: 56,
    margin: "12px 0 16px",
    letterSpacing: "-0.02em",
    maxWidth: 720
  }
}, "Egyszer\u0171 \xFCgyint\xE9z\xE9s,", /*#__PURE__*/React.createElement("br", null), "online."), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 20,
    fontWeight: 500,
    opacity: 0.85,
    margin: "0 0 36px",
    maxWidth: 600,
    lineHeight: 1.5
  }
}, "T\xF6bb mint 500 korm\xE1nyzati szolg\xE1ltat\xE1s egy helyen. L\xE9pj be \xDCgyf\xE9lkapuval \xE9s int\xE9zd otthonr\xF3l."), /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 720
  }
}, /*#__PURE__*/React.createElement(SearchHero, {
  value: query,
  onChange: e => setQuery(e.target.value),
  onSubmit: () => goTo("search")
}), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 8,
    marginTop: 16,
    flexWrap: "wrap"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 13,
    opacity: 0.75,
    padding: "6px 0"
  }
}, "N\xE9pszer\u0171:"), ["Lakcímkártya", "Útlevél", "Adóbevallás", "Anyakönyvi kivonat"].map(t => /*#__PURE__*/React.createElement("button", {
  key: t,
  onClick: () => {
    setQuery(t);
    goTo("search");
  },
  style: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: 9999,
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer"
  }
}, t)))))), /*#__PURE__*/React.createElement("section", {
  style: {
    background: "var(--neutral-surface)",
    padding: "64px 24px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 24
  }
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    font: "var(--type-h2)",
    margin: 0,
    letterSpacing: "-0.02em"
  }
}, "\xC9letesem\xE9nyek"), /*#__PURE__*/React.createElement("a", {
  href: "#",
  style: {
    fontWeight: 700,
    fontSize: 14,
    color: "var(--brand)"
  }
}, "\xD6sszes megtekint\xE9se \u2192")), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16
  }
}, TOPICS.map(t => /*#__PURE__*/React.createElement(TopicCard, _extends({
  key: t.id
}, t, {
  onClick: () => goTo("detail", t)
})))))), /*#__PURE__*/React.createElement("section", {
  style: {
    background: "#fff",
    padding: "64px 24px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 48,
    alignItems: "start"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
  style: {
    font: "var(--type-h2)",
    margin: "0 0 24px",
    letterSpacing: "-0.02em"
  }
}, "H\xEDrek \xE9s friss\xEDt\xE9sek"), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
}, NEWS.map(n => /*#__PURE__*/React.createElement("article", {
  key: n.title,
  style: {
    display: "flex",
    gap: 24,
    padding: "20px 0",
    borderBottom: "1px solid var(--neutral-border)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    flex: "0 0 120px",
    display: "flex",
    flexDirection: "column",
    gap: 4
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    background: "var(--indigo-200)",
    color: "var(--brand)",
    alignSelf: "flex-start",
    padding: "2px 10px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700
  }
}, n.tag), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 13,
    color: "var(--neutral-fg-tertiary)",
    fontWeight: 500
  }
}, n.date)), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("h3", {
  style: {
    font: "var(--type-h4)",
    margin: "0 0 6px"
  }
}, n.title), /*#__PURE__*/React.createElement("p", {
  style: {
    margin: 0,
    fontSize: 15,
    fontWeight: 500,
    color: "var(--neutral-fg-secondary)",
    lineHeight: 1.5
  }
}, n.desc)))))), /*#__PURE__*/React.createElement("aside", {
  style: {
    background: "var(--brand)",
    color: "#fff",
    borderRadius: 16,
    padding: 32
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-customer-service-2-fill",
  style: {
    fontSize: 32
  }
}), /*#__PURE__*/React.createElement("h3", {
  style: {
    font: "var(--type-h3)",
    margin: "12px 0 8px",
    color: "#fff"
  }
}, "\xDCgyf\xE9lszolg\xE1lat"), /*#__PURE__*/React.createElement("p", {
  style: {
    margin: "0 0 24px",
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.85,
    lineHeight: 1.5
  }
}, "H\xEDvd a 1818-as korm\xE1nyzati \xFCgyf\xE9lvonalat, vagy keress fel b\xE1rmelyik korm\xE1nyablakot."), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontWeight: 700,
    fontSize: 18
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-phone-line"
}), "1818"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    opacity: 0.75
  }
}, "H\xE9tf\u0151\u2013P\xE9ntek, 7\u201320 \xF3ra")), /*#__PURE__*/React.createElement("button", {
  onClick: () => alert("Időpontfoglalás megnyitása"),
  style: {
    marginTop: 24,
    width: "100%",
    background: "#fff",
    color: "var(--brand)",
    border: "none",
    padding: "12px 16px",
    borderRadius: 9999,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer"
  }
}, "Id\u0151pontot foglalok")))));

// ---------------------------------------------------------------- Login
const LoginPage = ({
  goTo
}) => {
  const [user, setUser] = React.useState("");
  const [pwd, setPwd] = React.useState("");
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: "var(--neutral-surface)",
      minHeight: "calc(100vh - 72px - 96px)",
      padding: "64px 24px",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 440,
      width: "100%",
      background: "#fff",
      borderRadius: 16,
      padding: 40,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }
  }, /*#__PURE__*/React.createElement(Brand, null), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "var(--type-h2)",
      letterSpacing: "-0.02em",
      margin: "24px 0 8px",
      fontSize: 28
    }
  }, "Bel\xE9p\xE9s"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: "var(--neutral-fg-secondary)",
      margin: "0 0 24px",
      lineHeight: 1.5
    }
  }, "L\xE9pj be \xDCgyf\xE9lkapu+ azonos\xEDt\xE1ssal a hivatalos szolg\xE1ltat\xE1sokhoz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: "Felhaszn\xE1l\xF3n\xE9v",
    icon: "ri-user-line",
    value: user,
    onChange: e => setUser(e.target.value),
    placeholder: "ugyfel.kapu"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Jelsz\xF3",
    icon: "ri-lock-line",
    type: "password",
    value: pwd,
    onChange: e => setPwd(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
  }), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      alignSelf: "flex-end",
      fontSize: 13,
      fontWeight: 700,
      color: "var(--brand)"
    }
  }, "Elfelejtett jelsz\xF3?"), /*#__PURE__*/React.createElement(Btn, {
    kind: "primary",
    size: "lg",
    full: true,
    onClick: () => goTo("home")
  }, "Bel\xE9p\xE9s"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      margin: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--neutral-border)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 500,
      color: "var(--neutral-fg-tertiary)"
    }
  }, "VAGY"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: "var(--neutral-border)"
    }
  })), /*#__PURE__*/React.createElement(Btn, {
    kind: "outline",
    size: "lg",
    icon: "ri-qr-code-line",
    full: true
  }, "Bel\xE9p\xE9s QR-k\xF3ddal"), /*#__PURE__*/React.createElement(Btn, {
    kind: "outline",
    size: "lg",
    icon: "ri-smartphone-line",
    full: true
  }, "Bel\xE9p\xE9s a D\xC1P-mobilr\xF3l")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      fontSize: 13,
      color: "var(--neutral-fg-tertiary)",
      textAlign: "center"
    }
  }, "Nincs m\xE9g fi\xF3kod? ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "var(--brand)",
      fontWeight: 700
    }
  }, "Regisztr\xE1lj"))));
};

// ---------------------------------------------------------------- Topic detail
const TopicDetail = ({
  topic,
  goTo
}) => /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--cold-grey-200)",
    padding: "16px 24px",
    borderBottom: "1px solid var(--neutral-border)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "flex",
    gap: 8,
    alignItems: "center",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--neutral-fg-secondary)"
  }
}, /*#__PURE__*/React.createElement("a", {
  onClick: () => goTo("home"),
  style: {
    color: "var(--brand)",
    fontWeight: 700,
    cursor: "pointer"
  }
}, "F\u0151oldal"), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-s-line"
}), /*#__PURE__*/React.createElement("a", {
  onClick: () => goTo("home"),
  style: {
    color: "var(--brand)",
    fontWeight: 700,
    cursor: "pointer"
  }
}, "\xC9letesem\xE9nyek"), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-s-line"
}), /*#__PURE__*/React.createElement("span", null, topic.title))), /*#__PURE__*/React.createElement("section", {
  style: {
    padding: "48px 24px",
    background: "#fff"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: 1320,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 280px",
    gap: 48,
    alignItems: "start"
  }
}, /*#__PURE__*/React.createElement("article", null, /*#__PURE__*/React.createElement("span", {
  style: {
    background: "var(--indigo-200)",
    color: "var(--brand)",
    padding: "4px 12px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  }
}, /*#__PURE__*/React.createElement("i", {
  className: topic.icon
}), "\xC9letesem\xE9ny"), /*#__PURE__*/React.createElement("h1", {
  style: {
    font: "var(--type-h1)",
    letterSpacing: "-0.02em",
    margin: "16px 0 12px",
    fontSize: 40
  }
}, topic.title), /*#__PURE__*/React.createElement("p", {
  style: {
    font: "var(--type-body-lg)",
    margin: "0 0 32px",
    color: "var(--neutral-fg-secondary)",
    maxWidth: 720
  }
}, topic.desc), /*#__PURE__*/React.createElement(Callout, {
  kind: "info",
  title: "Tudnival\xF3."
}, "A l\xE9p\xE9seket ak\xE1r otthonr\xF3l is el tudod int\xE9zni. A szem\xE9lyes megjelen\xE9s csak az utols\xF3 pontn\xE1l sz\xFCks\xE9ges."), /*#__PURE__*/React.createElement("h2", {
  style: {
    font: "var(--type-h3)",
    margin: "40px 0 16px",
    letterSpacing: "-0.01em"
  }
}, "L\xE9p\xE9sr\u0151l l\xE9p\xE9sre"), /*#__PURE__*/React.createElement("ol", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    paddingLeft: 0,
    listStyle: "none",
    margin: 0
  }
}, ["Készítsd elő a személyi igazolványod és a TAJ kártyád.", "Töltsd ki az online űrlapot — a rendszer automatikusan kitölti az ismert adatokat.", "Csatolj minden szükséges dokumentumot (max. 25 MB / fájl).", "Foglalj időpontot a kormányablakhoz az aláíráshoz."].map((step, i) => /*#__PURE__*/React.createElement("li", {
  key: i,
  style: {
    display: "flex",
    gap: 16,
    padding: 16,
    background: "var(--neutral-surface)",
    borderRadius: 12
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    flex: "0 0 32px",
    height: 32,
    borderRadius: 9999,
    background: "var(--brand)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14
  }
}, i + 1), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.5,
    color: "var(--neutral-fg-primary)"
  }
}, step)))), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    marginTop: 32
  }
}, /*#__PURE__*/React.createElement(Btn, {
  kind: "primary",
  size: "lg",
  iconRight: "ri-arrow-right-line"
}, "\xDCgyint\xE9z\xE9s ind\xEDt\xE1sa"), /*#__PURE__*/React.createElement(Btn, {
  kind: "outline",
  size: "lg",
  icon: "ri-download-line"
}, "PDF \xFAtmutat\xF3"))), /*#__PURE__*/React.createElement("aside", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    position: "sticky",
    top: 24
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--neutral-surface)",
    borderRadius: 12,
    padding: 20
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--neutral-fg-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  }
}, "EZEN AZ OLDALON"), /*#__PURE__*/React.createElement("ul", {
  style: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: 8
  }
}, ["Áttekintés", "Lépésről lépésre", "Szükséges iratok", "Díjak", "Időpontfoglalás"].map((s, i) => /*#__PURE__*/React.createElement("li", {
  key: s
}, /*#__PURE__*/React.createElement("a", {
  href: "#",
  style: {
    fontSize: 14,
    fontWeight: i === 1 ? 700 : 500,
    color: i === 1 ? "var(--brand)" : "var(--neutral-fg-secondary)",
    textDecoration: "none",
    display: "block",
    padding: "4px 0",
    borderLeft: i === 1 ? "2px solid var(--brand)" : "2px solid transparent",
    paddingLeft: 10
  }
}, s))))), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    border: "1px solid var(--neutral-border)",
    borderRadius: 12,
    padding: 20
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--neutral-fg-tertiary)",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  }
}, "SZ\xDCKS\xC9GES"), /*#__PURE__*/React.createElement("ul", {
  style: {
    listStyle: "none",
    padding: 0,
    margin: "12px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: 10
  }
}, [["ri-id-card-line", "Személyi igazolvány"], ["ri-bank-card-line", "Lakcímkártya"], ["ri-user-line", "Ügyfélkapu+"]].map(([i, l]) => /*#__PURE__*/React.createElement("li", {
  key: l,
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: 500,
    color: "var(--neutral-fg-primary)"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: i,
  style: {
    fontSize: 20,
    color: "var(--neutral-fg-tertiary)"
  }
}), l))))))));

// ---------------------------------------------------------------- 404
const Page404 = ({
  goTo
}) => /*#__PURE__*/React.createElement("main", {
  style: {
    minHeight: "calc(100vh - 72px - 96px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    textAlign: "center",
    maxWidth: 480
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 140,
    fontWeight: 700,
    color: "var(--brand)",
    letterSpacing: "-0.04em",
    lineHeight: 1
  }
}, "404"), /*#__PURE__*/React.createElement("h1", {
  style: {
    font: "var(--type-h2)",
    letterSpacing: "-0.02em",
    margin: "16px 0 12px"
  }
}, "OOPS! Technikai probl\xE9ma."), /*#__PURE__*/React.createElement("p", {
  style: {
    fontSize: 16,
    fontWeight: 500,
    color: "var(--neutral-fg-secondary)",
    margin: "0 0 24px",
    lineHeight: 1.5
  }
}, "Az oldal nem tal\xE1lhat\xF3, de semmi gond \u2014 t\xE9rj vissza a f\u0151oldalra \xE9s folytasd a b\xF6ng\xE9sz\xE9st."), /*#__PURE__*/React.createElement(Btn, {
  kind: "primary",
  size: "lg",
  onClick: () => goTo("home")
}, "Vissza a f\u0151oldalra")));
Object.assign(window, {
  HomePage,
  LoginPage,
  TopicDetail,
  Page404,
  TOPICS,
  NEWS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/citizen-portal/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/mobile-app/screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// DÁP mobile app — shared components & screens.

const APP_TOPICS = [{
  id: "id",
  icon: "ri-id-card-line",
  title: "Igazolványaim",
  hint: "Személyi, lakcím, TAJ"
}, {
  id: "letter",
  icon: "ri-mail-line",
  title: "Hivatalos levelek",
  hint: "3 olvasatlan"
}, {
  id: "appoint",
  icon: "ri-calendar-event-line",
  title: "Időpontok",
  hint: "Holnap 10:30"
}, {
  id: "tax",
  icon: "ri-bank-card-line",
  title: "Adóügyek",
  hint: "SZJA 2025"
}, {
  id: "health",
  icon: "ri-heart-pulse-line",
  title: "Egészségügy",
  hint: "TAJ + EESZT"
}, {
  id: "vehicle",
  icon: "ri-car-line",
  title: "Gépjárműveim",
  hint: "ABC-123"
}];
const AppHeader = ({
  name = "Anna",
  subtitle = "Üdv újra!"
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--brand)",
    padding: "20px 20px 24px",
    color: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: "relative",
    flex: "0 0 44px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    background: "var(--indigo-200)",
    color: "var(--brand)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    border: "2px solid #fff"
  }
}, "KA"), /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 9999,
    background: "var(--negative)",
    border: "2px solid var(--brand)"
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.1
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.85
  }
}, subtitle), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 18,
    fontWeight: 700
  }
}, "Kov\xE1cs ", name)), /*#__PURE__*/React.createElement("button", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    background: "#fff",
    color: "var(--brand)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-notification-3-line",
  style: {
    fontSize: 22
  }
}), /*#__PURE__*/React.createElement("span", {
  style: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 9999,
    background: "var(--negative)"
  }
}))));
const StatusCard = () => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: "-16px 16px 0",
    boxShadow: "0 4px 16px rgba(8,12,40,0.10)",
    position: "relative",
    zIndex: 2
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    background: "var(--semantic-green-200)",
    color: "var(--semantic-green-900)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-shield-check-fill",
  style: {
    fontSize: 18
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    lineHeight: 1.2
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    color: "var(--neutral-fg-tertiary)",
    fontWeight: 500
  }
}, "Azonos\xEDtva mint"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--neutral-fg-primary)"
  }
}, "Kov\xE1cs Anna \xB7 D\xC1P+")), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-s-line",
  style: {
    fontSize: 22,
    color: "var(--neutral-fg-tertiary)"
  }
})));
const SectionTitle = ({
  children,
  action
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: "20px 20px 12px"
  }
}, /*#__PURE__*/React.createElement("h2", {
  style: {
    font: "var(--type-h4)",
    margin: 0,
    letterSpacing: "-0.01em"
  }
}, children), action && /*#__PURE__*/React.createElement("a", {
  href: "#",
  style: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--brand)"
  }
}, action));
const QuickTile = ({
  icon,
  title,
  hint,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    border: "none",
    textAlign: "left",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    height: "100%",
    fontFamily: "var(--font-primary)"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "var(--indigo-200)",
    color: "var(--brand)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22
  }
}, /*#__PURE__*/React.createElement("i", {
  className: icon
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    flexDirection: "column",
    gap: 2
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 15,
    fontWeight: 700,
    color: "var(--neutral-fg-primary)",
    letterSpacing: "-0.01em"
  }
}, title), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--neutral-fg-tertiary)"
  }
}, hint)));
const InboxRow = ({
  from,
  subject,
  time,
  unread
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    gap: 12,
    padding: "14px 20px",
    borderBottom: "1px solid var(--neutral-border)",
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    background: unread ? "var(--brand)" : "transparent",
    marginTop: 8,
    flex: "0 0 8px"
  }
}), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1,
    lineHeight: 1.3,
    minWidth: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline"
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--neutral-fg-primary)"
  }
}, from), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 11,
    fontWeight: 500,
    color: "var(--neutral-fg-tertiary)"
  }
}, time)), /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 14,
    fontWeight: unread ? 700 : 500,
    color: unread ? "var(--neutral-fg-primary)" : "var(--neutral-fg-secondary)",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
}, subject)));
const TabBar = ({
  active,
  setActive
}) => {
  const tabs = [{
    id: "home",
    icon: "ri-home-5",
    label: "Főoldal"
  }, {
    id: "inbox",
    icon: "ri-mail",
    label: "Levelek"
  }, {
    id: "id",
    icon: "ri-id-card",
    label: "iD"
  }, {
    id: "help",
    icon: "ri-question",
    label: "Súgó"
  }, {
    id: "settings",
    icon: "ri-settings-3",
    label: "Beállítás"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderTop: "1px solid var(--neutral-border)",
      padding: "10px 8px 6px",
      display: "flex"
    }
  }, tabs.map(t => {
    const isActive = t.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => setActive(t.id),
      style: {
        flex: 1,
        background: "transparent",
        border: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        cursor: "pointer",
        padding: 4,
        fontFamily: "var(--font-primary)"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `${t.icon}-${isActive ? "fill" : "line"}`,
      style: {
        fontSize: 22,
        color: isActive ? "var(--brand)" : "var(--neutral-fg-tertiary)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: isActive ? 700 : 500,
        color: isActive ? "var(--brand)" : "var(--neutral-fg-tertiary)"
      }
    }, t.label));
  }));
};

// ---- screens ----
const HomeScreen = ({
  goTo
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--neutral-surface)",
    minHeight: "100%",
    paddingBottom: 24
  }
}, /*#__PURE__*/React.createElement(AppHeader, null), /*#__PURE__*/React.createElement(StatusCard, null), /*#__PURE__*/React.createElement(SectionTitle, {
  action: "\xD6sszes \u2192"
}, "Kiemelt men\xFCpontok"), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  }
}, APP_TOPICS.map(t => /*#__PURE__*/React.createElement(QuickTile, _extends({
  key: t.id
}, t, {
  onClick: () => t.id === "letter" && goTo("inbox")
})))), /*#__PURE__*/React.createElement(SectionTitle, {
  action: "Mind \u2192"
}, "Legut\xF3bbi \xE9rtes\xEDt\xE9sek"), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    margin: "0 16px",
    borderRadius: 16,
    overflow: "hidden"
  }
}, /*#__PURE__*/React.createElement(InboxRow, {
  unread: true,
  from: "NAV",
  subject: "SZJA-bevall\xE1s el\xE9rhet\u0151",
  time: "ma 09:14"
}), /*#__PURE__*/React.createElement(InboxRow, {
  unread: true,
  from: "Korm\xE1nyhivatal",
  subject: "\xDAj okm\xE1ny \xE9rkezett a korm\xE1nyablakba",
  time: "tegnap"
}), /*#__PURE__*/React.createElement(InboxRow, {
  from: "D\xC1P",
  subject: "\xDCdv\xF6zl\xFCnk a Digit\xE1lis \xC1llampolg\xE1rs\xE1g Programban",
  time: "04. 02."
})));
const InboxScreen = ({
  goTo
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--neutral-canvas)",
    minHeight: "100%"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "20px 20px 12px",
    background: "#fff",
    borderBottom: "1px solid var(--neutral-border)",
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("button", {
  onClick: () => goTo("home"),
  style: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 4
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-left-line",
  style: {
    fontSize: 22
  }
})), /*#__PURE__*/React.createElement("h1", {
  style: {
    font: "var(--type-h3)",
    margin: 0,
    letterSpacing: "-0.01em"
  }
}, "Hivatalos levelek"), /*#__PURE__*/React.createElement("span", {
  style: {
    marginLeft: "auto",
    background: "var(--indigo-200)",
    color: "var(--brand)",
    padding: "2px 8px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 700
  }
}, "3 \xFAj")), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff"
  }
}, /*#__PURE__*/React.createElement(InboxRow, {
  unread: true,
  from: "NAV",
  subject: "SZJA-bevall\xE1s el\xE9rhet\u0151 \u2014 k\xE9rj\xFCk, ellen\u0151rizze az adatokat",
  time: "ma 09:14"
}), /*#__PURE__*/React.createElement(InboxRow, {
  unread: true,
  from: "Korm\xE1nyhivatal",
  subject: "\xDAj okm\xE1ny \xE9rkezett a XII. ker\xFCleti korm\xE1nyablakba",
  time: "tegnap"
}), /*#__PURE__*/React.createElement(InboxRow, {
  unread: true,
  from: "BM",
  subject: "\xDAtlev\xE9l meg\xFAj\xEDt\xE1s visszaigazol\xE1s",
  time: "04. 09."
}), /*#__PURE__*/React.createElement(InboxRow, {
  from: "D\xC1P",
  subject: "\xDCdv\xF6zl\xFCnk a Digit\xE1lis \xC1llampolg\xE1rs\xE1g Programban",
  time: "04. 02."
}), /*#__PURE__*/React.createElement(InboxRow, {
  from: "OEP",
  subject: "TAJ sz\xE1m igazol\xE1s",
  time: "03. 28."
})));
const IDScreen = ({
  goTo
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--neutral-surface)",
    minHeight: "100%"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "var(--brand)",
    padding: "20px 20px 12px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("button", {
  onClick: () => goTo("home"),
  style: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    padding: 4
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-left-line",
  style: {
    fontSize: 22
  }
})), /*#__PURE__*/React.createElement("h1", {
  style: {
    font: "var(--type-h3)",
    margin: 0,
    color: "#fff",
    letterSpacing: "-0.01em"
  }
}, "Igazolv\xE1nyaim")), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "20px 16px 24px",
    background: "var(--brand)",
    color: "#fff"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "linear-gradient(135deg, var(--indigo-1100), var(--indigo-1400))",
    borderRadius: 16,
    padding: 20,
    color: "#fff",
    boxShadow: "0 16px 32px rgba(0,0,0,0.2)"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
  style: {
    fontSize: 11,
    fontWeight: 700,
    opacity: 0.7,
    letterSpacing: "0.06em"
  }
}, "SZEM\xC9LYAZONOS\xCDT\xD3"), /*#__PURE__*/React.createElement("h2", {
  style: {
    font: "var(--type-h4)",
    color: "#fff",
    margin: "4px 0 12px"
  }
}, "Kov\xE1cs Anna M\xE1ria")), /*#__PURE__*/React.createElement("i", {
  className: "ri-shield-check-fill",
  style: {
    fontSize: 24,
    opacity: 0.8
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    opacity: 0.7,
    fontWeight: 500
  }
}, "Sz\xFClet\xE9si id\u0151"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 700
  }
}, "1989. 03. 14.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    opacity: 0.7,
    fontWeight: 500
  }
}, "Okm\xE1nysz\xE1m"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "var(--font-mono)"
  }
}, "HU 487 921 3")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    opacity: 0.7,
    fontWeight: 500
  }
}, "\xC9rv\xE9nyes"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 700
  }
}, "2031. 03. 14-ig")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 10,
    opacity: 0.7,
    fontWeight: 500
  }
}, "Lakc\xEDm"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 13,
    fontWeight: 700
  }
}, "1051 Budapest"))))), /*#__PURE__*/React.createElement("div", {
  style: {
    padding: "16px 16px 24px"
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "var(--semantic-green-200)",
    color: "var(--semantic-green-900)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-bank-card-line",
  style: {
    fontSize: 22
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 15,
    fontWeight: 700
  }
}, "Lakc\xEDmk\xE1rtya"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--neutral-fg-tertiary)"
  }
}, "\xC9rv\xE9nyes \xB7 \xE1lland\xF3")), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-s-line",
  style: {
    fontSize: 22,
    color: "var(--neutral-fg-tertiary)"
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    alignItems: "center",
    gap: 12
  }
}, /*#__PURE__*/React.createElement("span", {
  style: {
    width: 40,
    height: 40,
    borderRadius: 10,
    background: "var(--semantic-blue-200)",
    color: "var(--semantic-blue-1100)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  }
}, /*#__PURE__*/React.createElement("i", {
  className: "ri-heart-pulse-line",
  style: {
    fontSize: 22
  }
})), /*#__PURE__*/React.createElement("div", {
  style: {
    flex: 1
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 15,
    fontWeight: 700
  }
}, "TAJ k\xE1rtya"), /*#__PURE__*/React.createElement("div", {
  style: {
    fontSize: 12,
    fontWeight: 500,
    color: "var(--neutral-fg-tertiary)"
  }
}, "123 456 789")), /*#__PURE__*/React.createElement("i", {
  className: "ri-arrow-right-s-line",
  style: {
    fontSize: 22,
    color: "var(--neutral-fg-tertiary)"
  }
}))));
Object.assign(window, {
  APP_TOPICS,
  AppHeader,
  StatusCard,
  SectionTitle,
  QuickTile,
  InboxRow,
  TabBar,
  HomeScreen,
  InboxScreen,
  IDScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/mobile-app/screens.jsx", error: String((e && e.message) || e) }); }

})();
