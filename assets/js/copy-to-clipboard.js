document.addEventListener("DOMContentLoaded", function () {
  const codeBlocks = document.querySelectorAll(
    "pre.highlight, .markdown-body pre",
  );

  codeBlocks.forEach((codeBlock) => {
    const copyButton = document.createElement("button");
    copyButton.className = "copy-code-button";
    copyButton.type = "button";
    copyButton.innerText = "COPY";

    copyButton.addEventListener("click", (e) => {
      const code = codeBlock.querySelector("code").innerText;

      window.navigator.clipboard.writeText(code).then(() => {
        copyButton.innerText = "COPIED!";
        copyButton.classList.add("copied");

        setTimeout(function () {
          copyButton.innerText = "COPY";
          copyButton.classList.remove("copied");
        }, 2000);
      });
    });

    codeBlock.style.position = "relative";
    codeBlock.appendChild(copyButton);
  });
});
