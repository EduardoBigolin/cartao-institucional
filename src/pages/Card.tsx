import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import IFRSLogo from "../assets/IFRSLogo.png";
import Lunch from "../components/Lunch";
import "../styles/Card.css";
import IFLogo from "/IFLogo.svg";
import { Header } from "../components/Header";
  export interface props {
    name: string;
    birth: string;
    group: string;
    href: string;
    link: string;
    lunch: boolean;
  }

export default function Card() {
  const authHeader = useAuthHeader();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<props>({
    name: "",
    birth: "",
    link: "",
    group: "",
    href: "",
    lunch: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/users", {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((response) => {
        console.log("response:", response.data.message.returnData.lunch);
        setData({
          name: response.data.message.returnData.name,
          birth: response.data.message.returnData.birthDate,
          link: response.data.message.returnData.linkAuthorized,
          group: response.data.message.returnData.course.sigla,
          href: response.data.message.returnData.photoFile,
          lunch: response.data.message.returnData.lunch,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Header href={data.href} />
      <>
        <div className={"card-body"}>
          {loading ? (
            <div className={"loading"}>
              <p>Carregando...</p>
            </div>
          ) : (
            <>
              <div className="logo-container">
                <img src={IFRSLogo} alt={"logo do ifrs"} className={"logo"} />
              </div>
              <div className={"card-content"}>
                <h1>{data.group}</h1>
                <div className={"user-content"}>
                  <img src={data.href} className={"avatar"} />
                  <span className={"student-name"}>{data.name}</span>
                  <span className={"birth-date"}>{data.birth}</span>
                </div>
                <Lunch date={"01/01/23"} isAuthorized={data.lunch} />
              </div>
              <div className={"vertical-line"}></div>
              <div className={"qrCode-container"}>
                <QRCodeSVG
                  className={"qrCode"}
                  value={data.link}
                  imageSettings={{
                    src: IFLogo,
                    x: undefined,
                    y: undefined,
                    height: 35,
                    width: 25,
                    excavate: true,
                  }}
                />
              </div>
            </>
          )}
        </div>
      </>
    </>
  );
}
