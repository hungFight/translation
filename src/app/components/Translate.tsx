"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MdOutlineVolumeUp } from "react-icons/md";
import useDebounce from "../hooks/useDebounce";
import { IoPencilOutline } from "react-icons/io5";

const Translate: FC<{ data: { [key: string]: string } | undefined }> = ({
  data,
}) => {
  const [languageSelected, setLanguageSelected] = useState<string>(
    data ? Object.keys(data)[0] : "",
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [textTranslated, setTranslated] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const preTextTranslated = useRef<string>("");

  const handleTranslate = async (lang: string) => {
      setLanguageSelected(lang);
      setLoading(true);
      const newText = await axios.get(
        "https://kvm3z0mr-5000.asse.devtunnels.ms/translation",
        {
          params: { p1: "auto", p2: lang, p3: text },
        },
      );
      setTranslated(newText.data);
      setLoading(false);
  };
  useEffect(() => {
    const diVH = document.querySelector(".autoHeight");
    if (textareaRef.current && diVH) {
      textareaRef.current.style.height = "150px";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
      diVH.setAttribute("style", `height: ${textareaRef.current.style.height}`);
    }
  }, [text]);

  const delay = useDebounce(text, 500);
  useEffect(() => {
   if(text) handleTranslate(languageSelected);
  }, [delay]);

  const handleValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 5000) {
      setLoading(true);
      setText(e.target.value);
    }
  };
  const handleVoice = async (langReader: string, textReader: string) => {
    if (!videoRef.current) videoRef.current = document.createElement("video");
    if (textReader) {
      if (preTextTranslated.current !== textReader) {
        const newText = await axios.get(
          "https://kvm3z0mr-5000.asse.devtunnels.ms/speak",
          {
            responseType: "blob",
            params: { lang: langReader, word: textReader },
          },
        );
        preTextTranslated.current = textReader;
        if (videoRef.current) {
          videoRef.current.src = URL.createObjectURL(newText.data);
          videoRef.current.play();
        }
      }
      if (videoRef.current) videoRef.current.play();
    }
  };
  return (
    <div className="flex items-center">
      <div className="mr-5 relative">
        {" "}
        <h2 className=" p-2">write your text below here</h2>{" "}
        <textarea
          ref={textareaRef}
          className="w-[400px] h-[150px] resize-none p-2 pb-10 rounded-[10px] overflow-hidden border border-[#cbcbcb] outline-0 focus:border-blue-500"
          onChange={handleValue}
        />
        <div className="absolute bottom-5 right-5 flex items-center">
          <p className="text-sm">{text.length} / 5.000</p>{" "}
          <IoPencilOutline className="text-[18px] ml-2" />
        </div>
        <div
          className="absolute bottom-5 left-5 flex items-center text-[23px] cursor-pointer"
          onClick={() => handleVoice("vi", text)}
        >
          <MdOutlineVolumeUp />
        </div>
      </div>
      <div>
        <div className="flex items-center ">
          <select
            onChange={(e) => handleTranslate(e.target.value)}
            className="outline-none p-2"
          >
            {data &&
              Object.keys(data).map((key) => (
                <option
                  key={key}
                  selected={languageSelected === key}
                  value={key}
                >
                  {data[key]}
                </option>
              ))}
          </select>
        </div>

        <div className="w-[400px] h-[150px] border border-[#cbcbcb] rounded-[10px] p-2 bg-[#e4e4e440] relative autoHeight">
          {loading ? (
            <div className="flex space-x-2 justify-center items-center w-fit mt-2">
              <span className="sr-only">Loading...</span>
              <div className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 bg-black rounded-full animate-bounce"></div>
            </div>
          ) : (
            textTranslated
          )}
          <div
            className="absolute bottom-2 left-5 text-[25px] cursor-pointer"
            onClick={() => handleVoice(languageSelected, textTranslated)}
          >
            <MdOutlineVolumeUp />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;
