"use client";
import { useEffect } from "react";

export default function HoverHandler() {
  useEffect(() => {
    var li_items = document.querySelectorAll(".sidebar");

    li_items.forEach((li_item) => {
      li_item.addEventListener("mouseenter", () => {
        li_item.closest(".wrapper").classList.remove("hover_collapse");
      });

      li_item.addEventListener("mouseleave", () => {
        li_item.closest(".wrapper").classList.add("hover_collapse");
      });
    });
  }, []);
}
