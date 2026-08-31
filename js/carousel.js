/* ============================================================================
   CAROUSELS  —  Kota Notes Adda
   ----------------------------------------------------------------------------
   Is file me do carousel hain:
     1.  Hero banner slider  (upar wala)
     2.  Faculty Testimonial slider

   Dono hamesha RIGHT -> LEFT chalte hain aur loop continuous hai — aakhri
   slide ke baad wapas pehli par "reset" nahi hota, agli slide bas usi
   direction me aati rehti hai.
   ============================================================================


   >>>>>>  NAYI BANNER IMAGE ADD KARNI HAI? SIRF NEECHE WALI LIST EDIT KARO  <<<

   1.  Image file ko  image/  folder me daal do.
   2.  Neeche  CAROUSEL_IMAGES  list me ek nayi line add kar do (comma ke saath).
   3.  Bas itna hi. Slide aur uska dot apne aap ban jayega — HTML chhune ki
       zaroorat nahi hai.

   BEST IMAGE SIZE :  1774 x 887 px   (ratio 2 : 1)  — abhi jo banner lagaya
                      hai wahi size hai. Baaki banners bhi ISI ratio ke
                      banwana, warna wo box me chhoti dikhengi aur dono
                      taraf khaali jagah aa jayegi.

                      Ratio badalna hi ho to css/custom-material.css me
                      .kn-viewport ka aspect-ratio bhi saath me badalna.

   Alag ratio ki image bhi chalegi — poori image dikhegi, crop nahi hogi.
   Bas upar-neeche thodi khaali jagah aa jayegi. Isliye best result ke liye
   sab images ek hi ratio ki rakho.

   Slide ka time badalna ho to  CAROUSEL_INTERVAL  ki value change kar do.
   ========================================================================== */

var CAROUSEL_IMAGES = [
  "image/Kota note slide 1.png",   // TODO: pehli banner image ka naam daalein
  "image/slide3.png",   // TODO: doosri banner image ka naam daalein
  "image/slide3.png"    // TODO: teesri banner image ka naam daalein
];

var CAROUSEL_INTERVAL = 3000;       // hero: har slide kitni der dikhe (ms)

var TESTIMONIAL_INTERVAL = 3000;    // testimonial: har slide kitni der dikhe (ms)


/* ==========================================================================
   Yahan se neeche ka code chhune ki zaroorat nahi hai.
   ========================================================================== */

var KN_REDUCE_MOTION = window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* -------------------------------------------------------------------------
   Chhota helper: transition khatam hone par ek baar callback chalao.
   Agar transition chali hi nahi (reduce-motion, ya browser ne event nahi
   bheja) to timeout se bhi chal jayega — carousel kabhi atkega nahi.
   ---------------------------------------------------------------------- */
function knAfterTransition(el, fn) {
  var done = false;

  function run() {
    if (done) { return; }
    done = true;
    el.removeEventListener("transitionend", handler);
    fn();
  }

  function handler(e) {
    if (e.target === el && e.propertyName === "transform") { run(); }
  }

  el.addEventListener("transitionend", handler);
  setTimeout(run, KN_REDUCE_MOTION ? 20 : 900);
}


/* =========================================================== 1. HERO ====== */

(function () {
  "use strict";

  var track = document.getElementById("knSlides");
  var dotsBox = document.getElementById("knDots");
  var root = document.querySelector(".kn-hero");

  if (!track || !root) { return; }

  var images = (CAROUSEL_IMAGES || []).filter(function (src) {
    return typeof src === "string" && src.trim() !== "";
  });

  // Koi image hi nahi di gayi to poora hero hide kar do, khaali box mat dikhao.
  if (images.length === 0) {
    root.style.display = "none";
    return;
  }

  var total = images.length;      // asli slides ki ginti
  var pos = 0;                    // 0 .. total   (total = pehli slide ka clone)
  var timer = null;
  var held = false;
  var dots = [];

  function makeSlide(src, i, isClone) {
    var slide = document.createElement("div");
    slide.className = "kn-slide";

    var img = document.createElement("img");
    img.src = src;
    img.alt = isClone ? "" : "Kota Notes Adda banner " + (i + 1);
    img.loading = (i === 0) ? "eager" : "lazy";
    // Image na mile to sirf usi slide ko chhupa do. visibility use ki hai,
    // display nahi — warna slide ki jagah gayab ho jati aur slider ka
    // hisaab bigad jata.
    img.onerror = function () { slide.style.visibility = "hidden"; };

    slide.appendChild(img);
    return slide;
  }

  /* ---- slides + dots build karo ---- */
  images.forEach(function (src, i) {
    track.appendChild(makeSlide(src, i, false));

    if (total > 1) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "kn-dot";
      dot.setAttribute("aria-label", "Slide " + (i + 1) + " dikhao");
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    }
  });

  /* ---- CONTINUOUS LOOP KA ASLI TRICK ----
     Pehli slide ka ek clone sabse aakhir me laga dete hain. Aakhri slide ke
     baad slider isi clone par aage badhta hai (yaani right -> left hi), aur
     jaise hi animation khatam hoti hai, bina animation ke asli pehli slide
     par set kar dete hain. Dono dikhne me bilkul same hain, isliye user ko
     koi jhatka ya "reset" mehsoos nahi hota. */
  if (total > 1) {
    var clone = makeSlide(images[0], 0, true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  /* ---- ek hi image ho to poori control patti chhupa do ---- */
  if (total < 2) {
    var nav = root.querySelector(".kn-nav");
    if (nav) { nav.style.display = "none"; }
  }

  function paint(animate) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = "translateX(" + (-pos * 100) + "%)";

    if (!animate) {
      // reflow force karo, warna transition:none agli animation ko bhi kha jata
      void track.offsetWidth;
      track.style.transition = "";
    }

    var real = pos % total;
    dots.forEach(function (d, i) {
      d.classList.toggle("is-active", i === real);
      d.setAttribute("aria-current", i === real ? "true" : "false");
    });
  }

  function next() {
    if (total < 2) { return; }
    // clone par khade hain to pehle chupke se asli slide 0 par aa jao
    if (pos >= total) { pos = 0; paint(false); }
    pos += 1;
    paint(true);
  }

  function prev() {
    if (total < 2) { return; }
    // slide 0 par hain to pehle chupke se clone par jao (dikhne me same hai),
    // taaki peechhe jaana bhi seedha lage, poora track ulta na daude
    if (pos <= 0) { pos = total; paint(false); }
    pos -= 1;
    paint(true);
  }

  function goTo(i) {
    if (pos >= total) { pos = 0; paint(false); }
    pos = i;
    paint(true);
  }

  // clone tak pahunchte hi asli pehli slide par switch — bina animation
  track.addEventListener("transitionend", function (e) {
    if (e.target !== track || e.propertyName !== "transform") { return; }
    if (pos >= total) { pos = 0; paint(false); }
  });

  function play() {
    if (KN_REDUCE_MOTION || total < 2) { return; }
    if (held || document.hidden) { return; }
    stop();
    timer = setInterval(next, CAROUSEL_INTERVAL);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() { stop(); play(); }

  /* ---- arrows ---- */
  var prevBtn = root.querySelector(".kn-arrow-prev");
  var nextBtn = root.querySelector(".kn-arrow-next");
  if (prevBtn) { prevBtn.addEventListener("click", function () { prev(); restart(); }); }
  if (nextBtn) { nextBtn.addEventListener("click", function () { next(); restart(); }); }

  /* ---- hover / focus pe rok do, hatane pe chalu ---- */
  root.addEventListener("mouseenter", function () { held = true; stop(); });
  root.addEventListener("mouseleave", function () { held = false; play(); });
  root.addEventListener("focusin", function () { held = true; stop(); });
  root.addEventListener("focusout", function () {
    // pointer abhi bhi hero ke andar ho to chalu mat karo
    if (!root.matches(":hover")) { held = false; play(); }
  });

  /* ---- tab background me jaye to timer band, wapas aaye to chalu ---- */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { play(); }
  });

  /* ---- keyboard: left / right arrow ---- */
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { prev(); restart(); }
    if (e.key === "ArrowRight") { next(); restart(); }
  });

  paint(false);
  play();
})();


/* ============================================== 2. FACULTY TESTIMONIAL ==== */
/*
   Yahan clone ki jagah "rotation" use ki hai: har slide ke baad pehla card
   DOM me aakhir me chala jata hai aur track bina animation ke 0 par set ho
   jata hai. Isse loop endless ho jata hai aur ek hi direction me chalta
   rehta hai — koi reset nahi.

   Kitne card ek saath dikhenge ye CSS decide karti hai (desktop 3, tablet 2,
   phone 1). JS card ki asli width naap kar hi chalta hai, isliye naye card
   add karne par ya screen ghumane par apne aap adjust ho jata hai.
*/

(function () {
  "use strict";

  var root = document.querySelector(".kn-fac-carousel");
  if (!root) { return; }

  var viewport = root.querySelector(".kn-fac-viewport");
  var track = root.querySelector(".kn-fac-track");
  if (!viewport || !track) { return; }

  var total = track.children.length;
  if (total === 0) { root.style.display = "none"; return; }

  var prevBtn = root.querySelector(".kn-fac-prev");
  var nextBtn = root.querySelector(".kn-fac-next");
  var dotsBox = root.querySelector("#knFacDots");

  var busy = false;
  var timer = null;
  var held = false;
  var active = 0;          // is waqt sabse pehle kaunsa card dikh raha hai
  var dots = [];

  /* ---- dots: har testimonial ka ek dot ---- */
  if (dotsBox && total > 1) {
    for (var d = 0; d < total; d++) {
      (function (i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "kn-dot";
        dot.setAttribute("aria-label", "Testimonial " + (i + 1) + " dikhao");
        dot.addEventListener("click", function () { seek(i); restart(); });
        dotsBox.appendChild(dot);
        dots.push(dot);
      })(d);
    }
  }

  function paintDots() {
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === active);
      dot.setAttribute("aria-current", i === active ? "true" : "false");
    });
  }

  function gapPx() {
    var cs = window.getComputedStyle(track);
    return parseFloat(cs.columnGap || cs.gap) || 0;
  }

  // ek card + gap = ek step kitne pixel ka hai
  function stepPx() {
    var first = track.firstElementChild;
    if (!first) { return 0; }
    return first.getBoundingClientRect().width + gapPx();
  }

  // screen par is waqt kitne card dikh rahe hain
  function perView() {
    var s = stepPx();
    if (!s) { return 1; }
    return Math.max(1, Math.round((viewport.getBoundingClientRect().width + gapPx()) / s));
  }

  function canSlide() { return total > perView(); }

  function setX(px, animate) {
    track.style.transition = animate ? "" : "none";
    track.style.transform = "translateX(" + px + "px)";
    if (!animate) {
      void track.offsetWidth;
      track.style.transition = "";
    }
  }

  function go(dir, done) {
    if (busy || !canSlide()) { if (done) { done(); } return; }
    var s = stepPx();
    if (!s) { if (done) { done(); } return; }
    busy = true;
    active = (active + (dir > 0 ? 1 : -1) + total) % total;
    paintDots();

    if (dir > 0) {
      // aage: card left ki taraf sarak jaye, phir pehla card aakhir me
      setX(-s, true);
      knAfterTransition(track, function () {
        track.appendChild(track.firstElementChild);
        setX(0, false);
        busy = false;
        if (done) { done(); }
      });
    } else {
      // peechhe: aakhri card pehle laga do aur wahi se 0 tak animate karo
      track.insertBefore(track.lastElementChild, track.firstElementChild);
      setX(-s, false);
      setX(0, true);
      knAfterTransition(track, function () {
        busy = false;
        if (done) { done(); }
      });
    }
  }

  /* Dot par click: chhote raste se target tak ek-ek karke slide karo,
     taaki animation continuous lage — koi jump nahi. */
  function seek(target) {
    if (busy || !canSlide()) { return; }
    var fwd = (target - active + total) % total;
    if (fwd === 0) { return; }
    var dir = (fwd <= total - fwd) ? 1 : -1;
    var n = (dir > 0) ? fwd : (total - fwd);
    (function chain() {
      if (n-- <= 0) { return; }
      go(dir, chain);
    })();
  }

  function play() {
    if (KN_REDUCE_MOTION || !canSlide()) { return; }
    if (held || document.hidden) { return; }
    stop();
    timer = setInterval(function () { go(1); }, TESTIMONIAL_INTERVAL);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function restart() { stop(); play(); }

  // saare card ek saath dikh rahe hon to arrows chhupa do
  // saare card ek saath dikh rahe hon to poori control patti chhupa do
  function sync() {
    var on = canSlide();
    var nav = root.querySelector(".kn-nav");
    if (nav) { nav.style.display = on ? "" : "none"; }
    if (!on) { stop(); setX(0, false); } else { play(); }
  }

  if (prevBtn) { prevBtn.addEventListener("click", function () { go(-1); restart(); }); }
  if (nextBtn) { nextBtn.addEventListener("click", function () { go(1); restart(); }); }

  root.addEventListener("mouseenter", function () { held = true; stop(); });
  root.addEventListener("mouseleave", function () { held = false; play(); });
  root.addEventListener("focusin", function () { held = true; stop(); });
  root.addEventListener("focusout", function () {
    if (!root.matches(":hover")) { held = false; play(); }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { play(); }
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { go(-1); restart(); }
    if (e.key === "ArrowRight") { go(1); restart(); }
  });

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sync, 200);
  });

  setX(0, false);
  paintDots();
  sync();
})();
