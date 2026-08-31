/**
 * ============================================================
 * CATEGORY FILTER + PAGE RESTORE FIX
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {

  // ------------------------------------------------------------
  // Get ONLY actual filter buttons
  // Test Series is NOT included because it is a link to test.html
  // ------------------------------------------------------------

  const categoryBtns = document.querySelectorAll(
    '.category-btn[data-filter]'
  );

  const cards = document.querySelectorAll('.card');

  const categoryHeading =
    document.getElementById('category-heading');


  // ------------------------------------------------------------
  // Heading names
  // ------------------------------------------------------------

  const headingNames = {

    all: 'ALL Study Material',

    jee: 'JEE Study Material',

    neet: 'NEET Study Material',

    foundation: 'Foundation Study Material',

    test: 'Test Series Material',

    qb: 'Question Bank',

  };


  // ------------------------------------------------------------
  // Rating stars
  // ------------------------------------------------------------

  document.querySelectorAll('.card-info').forEach(function (info) {

    // Prevent creating rating container multiple times
    if (info.querySelector('.rating-container')) {
      return;
    }

    const starSpans = Array.from(info.children).filter(function (child) {

      return child.tagName === 'SPAN';

    });


    if (starSpans.length > 0) {

      const ratingDiv = document.createElement('div');

      ratingDiv.className = 'rating-container';


      // Insert before first star
      info.insertBefore(ratingDiv, starSpans[0]);


      // Move stars inside rating container
      starSpans.forEach(function (span) {

        ratingDiv.appendChild(span);

      });

    }

  });


  // ------------------------------------------------------------
  // APPLY FILTER
  // ------------------------------------------------------------

  function applyFilter(filter) {

    // Safety:
    // If filter doesn't exist, always return to ALL
    if (!filter || !headingNames[filter]) {

      filter = 'all';

    }


    // ----------------------------------------------------------
    // Number of cards to show
    // ----------------------------------------------------------

    let limit = Infinity;


    if (filter === 'jee' || filter === 'test') {

      limit = 24;

    }
    else if (filter !== 'all') {

      limit = 16;

    }


    let visibleCount = 0;


    // ----------------------------------------------------------
    // Show / Hide cards
    // ----------------------------------------------------------

    cards.forEach(function (card) {

      const category =
        (card.getAttribute('data-category') || '').toLowerCase();


      // ALL
      if (filter === 'all') {

        if (visibleCount < limit) {

          card.style.display = '';

          visibleCount++;

        }
        else {

          card.style.display = 'none';

        }

        return;
      }


      // Other categories
      if (category.includes(filter)) {

        if (visibleCount < limit) {

          card.style.display = '';

          visibleCount++;

        }
        else {

          card.style.display = 'none';

        }

      }
      else {

        card.style.display = 'none';

      }

    });


    // ----------------------------------------------------------
    // Change heading
    // ----------------------------------------------------------

    if (categoryHeading) {

      categoryHeading.textContent =
        headingNames[filter];

    }


    // ----------------------------------------------------------
    // Change active button
    // ----------------------------------------------------------

    categoryBtns.forEach(function (btn) {

      btn.classList.remove('active');

    });


    const activeBtn =
      document.querySelector(
        '.category-btn[data-filter="' + filter + '"]'
      );


    if (activeBtn) {

      activeBtn.classList.add('active');

    }

  }


  // ------------------------------------------------------------
  // CATEGORY BUTTON CLICK
  // ------------------------------------------------------------

  categoryBtns.forEach(function (btn) {

    btn.addEventListener('click', function () {

      const filter =
        btn.getAttribute('data-filter');


      // Apply selected filter
      applyFilter(filter);


      // --------------------------------------------------------
      // IMPORTANT:
      // Store selected category
      // --------------------------------------------------------

      sessionStorage.setItem(
        'selectedCategory',
        filter
      );

    });

  });


  // ------------------------------------------------------------
  // TEST SERIES CLICK
  // ------------------------------------------------------------

  const testSeriesBtn =
    document.querySelector('.test-series-btn');


  if (testSeriesBtn) {

    testSeriesBtn.addEventListener('click', function () {

      // Before leaving home page,
      // remember that when user comes back,
      // ALL should be displayed.

      sessionStorage.setItem(
        'selectedCategory',
        'all'
      );

    });

  }


  // ------------------------------------------------------------
  // INITIAL LOAD
  // ------------------------------------------------------------

  // ALWAYS show ALL when Home page is opened normally.
  applyFilter('all');


  // ------------------------------------------------------------
  // IMPORTANT FIX:
  // Handle browser BACK / FORWARD
  // ------------------------------------------------------------

  window.addEventListener('pageshow', function (event) {

    /*
     * pageshow fires when the page comes back from
     * browser Back/Forward cache.
     *
     * This is the main fix for your problem.
     */

    if (event.persisted) {

      // Reset Home page to ALL
      applyFilter('all');


      // Clear previous filter
      sessionStorage.setItem(
        'selectedCategory',
        'all'
      );

    }

  });

});