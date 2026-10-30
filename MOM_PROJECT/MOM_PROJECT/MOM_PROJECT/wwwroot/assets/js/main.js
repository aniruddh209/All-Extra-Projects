/**
 * Template Name: NiceAdmin
 * Template URL: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/
 * Updated: Apr 20 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function (FIXED)
   */
  const on = (type, el, listener, all = false) => {
    let elements = select(el, all);
    if (!elements) return;

    if (all) {
      elements.forEach(e => e && e.addEventListener(type, listener));
    } else {
      elements.addEventListener(type, listener);
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el && el.addEventListener('scroll', listener);
  };

  /**
   * Sidebar toggle
   */
  if (select('.toggle-sidebar-btn')) {
    on('click', '.toggle-sidebar-btn', function () {
      select('body').classList.toggle('toggle-sidebar');
    });
  }

  /**
   * Search bar toggle
   */
  if (select('.search-bar-toggle') && select('.search-bar')) {
    on('click', '.search-bar-toggle', function () {
      select('.search-bar').classList.toggle('search-bar-show');
    });
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;

      if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };

  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Header scrolled
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Tooltips
   */
  if (typeof bootstrap !== "undefined") {
    document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(el => new bootstrap.Tooltip(el));
  }

  /**
   * Quill editors (SAFE)
   */
  if (typeof Quill !== "undefined") {
    if (select('.quill-editor-default')) {
      new Quill('.quill-editor-default', { theme: 'snow' });
    }

    if (select('.quill-editor-bubble')) {
      new Quill('.quill-editor-bubble', { theme: 'bubble' });
    }

    if (select('.quill-editor-full')) {
      new Quill('.quill-editor-full', {
        modules: {
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "super" }, { script: "sub" }],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["direction", { align: [] }],
            ["link", "image", "video"],
            ["clean"]
          ]
        },
        theme: "snow"
      });
    }
  }

  /**
   * TinyMCE (SAFE)
   */
  if (typeof tinymce !== "undefined") {
    tinymce.init({
      selector: 'textarea.tinymce-editor',
      height: 600,
      menubar: true,
      plugins:
          'preview importcss searchreplace autolink autosave save directionality code visualblocks fullscreen image link media table lists wordcount help',
      toolbar:
          'undo redo | bold italic underline | align | numlist bullist | link image | code fullscreen'
    });
  }

  /**
   * Bootstrap validation
   */
  document.querySelectorAll('.needs-validation').forEach(form => {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  /**
   * Datatables (SAFE)
   */
  if (typeof simpleDatatables !== "undefined") {
    select('.datatable', true).forEach(datatable => {
      new simpleDatatables.DataTable(datatable, {
        perPageSelect: [5, 10, 15, ["All", -1]]
      });
    });
  }

  /**
   * Echarts resize (SAFE)
   */
  if (typeof echarts !== "undefined") {
    const mainContainer = select('#main');
    if (mainContainer) {
      setTimeout(() => {
        new ResizeObserver(() => {
          select('.echart', true).forEach(chart => {
            let instance = echarts.getInstanceByDom(chart);
            if (instance) instance.resize();
          });
        }).observe(mainContainer);
      }, 200);
    }
  }

})();