import { useSetRecoilState } from "recoil";

import { modalAtom } from "./modal.atom";

const useModal = () => {
  const setModal = useSetRecoilState(modalAtom);

  const openModal = (modal) => setModal({ modal, opened: true });

  const closeModal = () => setModal({ modal: <></>, opened: false });

  return { openModal, closeModal };
};

export { useModal };
