import { useEffect, useState } from "react";

import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const [portal, setPortal] = useState();

  useEffect(() => {
    const node = document.getElementById("portal");
    if (node) setPortal(node);
  }, []);

  if (!portal) return null;

  return createPortal(children, portal);
};

export default Portal;
