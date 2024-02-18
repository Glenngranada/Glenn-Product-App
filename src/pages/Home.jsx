import { useEffect } from "react";
import Charts from "../components/Charts";
import KPI from "../components/KPI";
import useStockCalls from "../service/useGlennAppsCalls";

const Home = () => {
  const { getStocks } = useStockCalls();

  useEffect(() => {
    getStocks("sales");
    getStocks("purchases");
  }, []);

  return (
    <>
      <KPI />
      <Charts />
    </>
  );
};

export default Home;
