document.addEventListener("DOMContentLoaded", function () {
  const typeWriterElement = document.getElementById("typewriter-text");
  if (!typeWriterElement) return;
  
  let index = 0;
  
  function typeWriter() {
    const textToType = "Hello, I am 0xK4z, a Cyber Security Analyst.";
    
    if (index < textToType.length) {
      typeWriterElement.innerHTML += textToType.charAt(index);
      index++;
      setTimeout(typeWriter, 150);
    } else if (index === textToType.length) {
      setTimeout(() => {
        typeWriterElement.innerHTML = "";
        index = 0;
        typeWriter();
      }, 3000);
    }
  }

  typeWriter();
});