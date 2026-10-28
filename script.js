/* ===== MOBILE MENU START ===== */
// Close the mobile menu after a link is tapped (page scrolls to the section)
$('#menu .nav-link').on('click', function () { $('#menu').collapse('hide'); });
/* ===== MOBILE MENU END ===== */


/* ===== FOOTER YEAR START ===== */
$('#year').text(new Date().getFullYear());
/* ===== FOOTER YEAR END ===== */


/* ===== IMAGE PREVIEW START ===== */
// Shows the chosen picture under the file input
function previewImage(inputSel, imgSel) {
  $(inputSel).on('change', function () {
    var file = this.files[0];
    if (!file) return $(imgSel).addClass('d-none');
    var reader = new FileReader();
    reader.onload = function (e) { $(imgSel).attr('src', e.target.result).removeClass('d-none'); };
    reader.readAsDataURL(file);
  });
}
previewImage('#profileInput', '#profilePreview');
previewImage('#receiptInput', '#receiptPreview');
/* ===== IMAGE PREVIEW END ===== */


/* ===== AJAX HELPERS START ===== */
// Sends a form to the server with Ajax and shows a message.
// Change the URLs (api/*.php) to match your backend.
function showMsg(sel, type, text) {
  $(sel).html('<div class="alert alert-' + type + ' mb-0">' + text + '</div>');
}

function ajaxForm(formSel, url, msgSel, successText, validate) {
  $(formSel).on('submit', function (e) {
    e.preventDefault();
    var form = this;

    if (!form.checkValidity() || (validate && !validate())) {
      form.reportValidity();
      return;
    }

    $.ajax({
      url: url,
      method: 'POST',
      data: new FormData(form),   // supports file uploads
      processData: false,
      contentType: false,
      beforeSend: function () { showMsg(msgSel, 'info', 'Sending...'); },
      success: function () { showMsg(msgSel, 'success', successText); form.reset(); $('.preview').addClass('d-none'); },
      error: function () { showMsg(msgSel, 'danger', 'Could not send. Please try again or contact us on WhatsApp.'); }
    });
  });
}

ajaxForm('#admissionForm', 'api/admission.php', '#admissionMsg',
  'Admission submitted. We will contact you soon.',
  function () {
    if (!$('#terms').is(':checked')) { showMsg('#admissionMsg', 'warning', 'Please accept the terms and conditions.'); return false; }
    return true;
  });
ajaxForm('#contactForm', 'api/contact.php', '#contactMsg', 'Message sent. Thank you!');
ajaxForm('#loginForm', 'api/login.php', '#loginMsg', 'Logged in successfully.');
/* ===== AJAX HELPERS END ===== */


/* ===== TRACKING SEARCH START ===== */
// Looks up an application by phone or CNIC with Ajax (GET)
$('#trackForm').on('submit', function (e) {
  e.preventDefault();
  var value = $('#trackValue').val().trim();
  if (!value) return;

  $.ajax({
    url: 'api/track.php',
    method: 'GET',
    dataType: 'json',
    data: { type: $('#trackType').val(), q: value },
    beforeSend: function () { showMsg('#trackResult', 'info', 'Searching...'); },
    success: function (res) {
      if (res && res.found) showMsg('#trackResult', 'success', 'Tracking ID: <strong>' + res.id + '</strong><br>Status: ' + res.status);
      else showMsg('#trackResult', 'warning', 'No record found. Check the number and try again.');
    },
    error: function () { showMsg('#trackResult', 'danger', 'Search is unavailable right now. Please contact us.'); }
  });
});
/* ===== TRACKING SEARCH END ===== */


/* ===== CARD REVEAL ANIMATION START ===== */
// Adds the .in class when a card scrolls into view (CSS does the animation)
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) { entry.target.classList.add('in'); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
/* ===== CARD REVEAL ANIMATION END ===== */


/* ===== CHOOSE PACKAGE START ===== */
// "Choose package" selects that package in the admission form and scrolls to it
$('.choose-package').on('click', function () {
  $('select[name="package"]').val($(this).data('package'));
  document.getElementById('admission').scrollIntoView({ behavior: 'smooth' });
});
/* ===== CHOOSE PACKAGE END ===== */

/* ===== COURSE FILTER START ===== */
$('.filter-btn').on('click', function () {
  const filter = $(this).data('filter');
  $('.filter-btn').removeClass('active');
  $(this).addClass('active');

  $('.course-item').each(function () {
    const categories = $(this).data('category') || '';
    const matches = filter === 'all' || categories.toString().toLowerCase().includes(filter);
    $(this).toggleClass('hidden', !matches);
  });
});
/* ===== COURSE FILTER END ===== */
