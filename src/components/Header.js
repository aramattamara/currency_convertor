import {heading} from "../config/api";

export default function Header(){
  return(
      <div className="header">
        <span>{heading}</span>
      </div>
  );
}