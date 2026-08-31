/* ============================================================================
   USEFUL LINKS  —  Kota Notes Adda
   ============================================================================

   >>>>>>  LINK BADALNA / JODNA HAI? SIRF NEECHE WALI LIST EDIT KARO  <<<<<<

   Har entry me 3 cheezein hain:

     label :  jo text page par dikhega        (jaise "DPPs")
     href  :  kahan le jayega                 (abhi "#" dummy hai)
     icon  :  Font Awesome ka icon naam       (https://fontawesome.com/icons)

   >>  icon me sirf naam likho, jaise  "fa-house"  — style apne aap
       fa-solid lag jata hai, isliye saare icons ek jaise dikhte hain.
       Jaan-boojh kar doosra style chahiye tabhi poora likho, jaise
       "fa-regular fa-house" (outline) ya "fab fa-whatsapp" (brand logo).

   >>  href me abhi "#" (dummy) daala hua hai — page ready hote hi bas
       "#" ki jagah asli link daal dena, jaise:

           href: "dpp.html"                       (isi site ka page)
           href: "Allen digital.html#materials"   (isi page ka section)
           href: "https://drive.google.com/..."   (bahar ka link)

       "http" se shuru hone wale link apne aap naye tab me khulenge.

   >>  Nayi link jodni ho to bas ek nayi { ... } line comma ke saath add
       kar do — card apne aap ban jayega, HTML chhune ki zaroorat nahi.
   ========================================================================== */

var USEFUL_LINKS = [
  { label: "Home",           href: "index.html", icon: "fa-house" },        // TODO: asli link daalein
  { label: "DPPs",           href: "DPP.html", icon: "fa-file-lines" },   // TODO: asli link daalein
  { label: "PPTs", href: "PPT.html", icon: "fa-list-check" },   // TODO: asli link daalein
  { label: "Test Series",          href: "Test.html", icon: "fa-file-pen" },     // TODO: asli link daalein
  { label: "Question Banks", href: "Q_Bank.html", icon: "fa-list-check" },   // TODO: asli link daalein
   
];


/* ==========================================================================
   Yahan se neeche ka code chhune ki zaroorat nahi hai.
   ========================================================================== */

(function () {
  "use strict";

  var box = document.getElementById("knLinks");
  if (!box) { return; }

  var items = (USEFUL_LINKS || []).filter(function (it) {
    return it && typeof it.label === "string" && it.label.trim() !== "";
  });

  // Ek bhi link na ho to poora section chhupa do, khaali heading mat dikhao.
  if (items.length === 0) {
    var section = box.closest ? box.closest(".kn-links") : null;
    if (section) { section.style.display = "none"; }
    return;
  }

  items.forEach(function (it) {
    var href = it.href || "#";

    var a = document.createElement("a");
    a.className = "kn-link";
    a.href = href;

    // Bahar ka link ho to naye tab me kholo
    if (href.indexOf("http") === 0) {
      a.target = "_blank";
      a.rel = "noopener";
    }

    // Icon me agar style pehle se likha hai (fa-solid / fa-regular / fab
    // waghairah) to usi ko rakho, warna fa-solid laga do — taaki sirf
    // "fa-house" likhne par bhi icon baaki jaisa hi solid dikhe.
    var cls = String(it.icon || "fa-link").trim();
    if (!/(^|\s)(fa-solid|fa-regular|fa-light|fa-thin|fa-duotone|fa-brands|fas|far|fal|fab)(\s|$)/.test(cls)) {
      cls = "fa-solid " + cls;
    }

    var icon = document.createElement("i");
    icon.className = cls;
    a.appendChild(icon);

    var label = document.createElement("span");
    label.textContent = it.label;
    a.appendChild(label);

    // Arrow — isse saaf pata chalta hai ki ye kahin le jaane wala link hai
    var go = document.createElement("i");
    go.className = "fa-solid fa-arrow-right kn-link-go";
    go.setAttribute("aria-hidden", "true");
    a.appendChild(go);

    box.appendChild(a);
  });
})();
