/* eslint-disable */

import Head from "next/head";
import type { MouseEvent, ReactNode } from "react";
import type {
  CloudinaryCallbackImage,
  CloudinaryWidget,
  CloudinaryWidgetResult,
} from "@/types";

interface ChildrenProps {
  open: (e: MouseEvent) => void;
}

interface CloudinaryUploadWidgetProps {
  callback: (image: CloudinaryCallbackImage) => void;
  children: (props: ChildrenProps) => ReactNode;
}

export default function CloudinaryUploadWidget({
  callback,
  children,
}: CloudinaryUploadWidgetProps) {
  function showWidget() {
    const widget: CloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dk2cds2bv",
        uploadPreset: "zitejvkj",
        cropping: true,
      },
      (error: unknown | undefined, result: CloudinaryWidgetResult) => {
        if (!error && result && result.event === "success") {
          callback(result.info);
        }
      }
    );

    widget.open();
  }

  function open(e: MouseEvent) {
    e.preventDefault();
    showWidget();
  }

  return (
    <>
      <Head>
        {/* Next.js specific, or download the script in componentDidMount */}
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
      </Head>
      {children({ open })}
      <style jsx>{`
        /* Add your styles here */
        button {
          background-color: #4caf50; /* Green background */
          color: white; /* White text */
          border: none; /* No border */
          padding: 10px 15px; /* Padding */
          text-align: center; /* Center text */
          text-decoration: none; /* Remove underline */
          display: inline-block; /* Make it an inline block */
          font-size: 14px; /* Increase font size */
          cursor: pointer; /* Add cursor pointer */
          border-radius: 4px; /* Add some border radius */
        }

        button:hover {
          background-color: #45a049; /* Darker green on hover */
        }
      `}</style>
    </>
  );
}
