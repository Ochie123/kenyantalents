"use client";

import DynamicIcon from "./DynamicIcon";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Social: React.FC<{ socialName: string; className: string }> = ({
  socialName,
  className,
}: {
  socialName: string;
  className: string;
}) => {
  const pathname = usePathname();
  const [baseUrl, setBaseUrl] = useState("");
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleCopyLink = () => {
    const fullLink = `${baseUrl}${pathname}`;
    const textArea = document.createElement("textarea");
    textArea.value = fullLink;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setIsTooltipVisible(true);
    setTimeout(() => {
      setIsTooltipVisible(false);
    }, 1000);
  };

  return (
    <ul className={`flex flex-row gap-4 items-center ${className}`}>
      <li>
        <a
          aria-label={socialName}
          href={`https://www.facebook.com/sharer/sharer.php?u=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="hover:opacity-80 transition-opacity"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block w-5 h-5" icon={"FaFacebookF"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://twitter.com/intent/tweet?text=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="hover:opacity-80 transition-opacity"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block w-5 h-5" icon={"FaXTwitter"} />
        </a>
      </li>

      <li>
        <a
          aria-label={socialName}
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${baseUrl}${pathname}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="hover:opacity-80 transition-opacity"
        >
          <span className="sr-only">{socialName}</span>
          <DynamicIcon className="inline-block w-5 h-5" icon={"FaLinkedinIn"} />
        </a>
      </li>

      <li>
        <a
          className="cursor-pointer relative hover:opacity-80 transition-opacity"
          onClick={handleCopyLink}
          aria-label="Copy Link"
        >
          <span className="sr-only">Copy Link</span>
          {isTooltipVisible && (
            <span className="text-xs absolute -right-16 top-1/2 -translate-y-1/2 text-text dark:text-darkmode-text whitespace-nowrap flex items-center gap-1">
              <DynamicIcon
                className="inline-block text-green-500 w-4 h-4"
                icon={"FaLink"}
              />
              copied!
            </span>
          )}
          <DynamicIcon className="inline-block w-5 h-5" icon={"FaRegCopy"} />
        </a>
      </li>
    </ul>
  );
};

export default Social;