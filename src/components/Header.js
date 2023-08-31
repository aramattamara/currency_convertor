import {heading} from "../config/api";

export default function Header(){
  return(
      <div className="header">
        <h1>{heading}</h1>
      </div>
  );
}