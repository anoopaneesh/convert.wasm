import dynamic from "next/dynamic";
import App from "./App";



const  Home = () => {

  return (
    <App />
  );
}

export default dynamic(() => Promise.resolve(Home), { 
  ssr: false 
})
