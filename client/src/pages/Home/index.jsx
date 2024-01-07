import { useOptions } from "../../common/context/options";
import Canvas from "../../modules/rooms/components/Canvas";

const Home = () => {
  const { options } = useOptions();
  console.log(options);

  return <Canvas />;
};

export default Home;
