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

/* ===== ADMISSION STEP NAV START ===== */
(function () {
  var form = document.getElementById('admissionForm');
  if (!form) return;

  var steps = Array.from(form.querySelectorAll('.form-step'));
  var stepItems = Array.from(document.querySelectorAll('.step-item'));
  var prevBtn = form.querySelector('.step-prev');
  var nextBtn = form.querySelector('.step-next');
  var submitBtn = form.querySelector('.step-submit');
  var currentStep = 0;

  function updateReview() {
    var first = form.querySelector('[name="first_name"]').value.trim();
    var last = form.querySelector('[name="last_name"]').value.trim();
    var phone = form.querySelector('[name="phone"]').value.trim();
    var cnic = form.querySelector('[name="cnic"]').value.trim();
    var course = form.querySelector('[name="package"]').value.trim();
    var payment = form.querySelector('[name="payment"]').value.trim();
    var startDate = form.querySelector('[name="start_date"]').value.trim();

    document.getElementById('review-name').textContent = (first || 'Unknown') + (last ? ' ' + last : '');
    document.getElementById('review-phone').textContent = phone || '-';
    document.getElementById('review-cnic').textContent = cnic || '-';
    document.getElementById('review-course').textContent = course || '-';
    document.getElementById('review-payment').textContent = payment || '-';
    document.getElementById('review-date').textContent = startDate || '-';
  }

  function updateStepUI() {
    steps.forEach(function (step, index) {
      step.classList.toggle('active', index === currentStep);
    });

    stepItems.forEach(function (item, index) {
      item.classList.toggle('active', index === currentStep);
      item.classList.toggle('complete', index < currentStep);
    });

    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-flex';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-flex';
    submitBtn.style.display = currentStep === steps.length - 1 ? 'inline-flex' : 'none';

    if (currentStep === steps.length - 1) {
      updateReview();
    }
  }

  function validateCurrentStep() {
    var fields = steps[currentStep].querySelectorAll('input, select, textarea');
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (field.required && !field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  prevBtn.addEventListener('click', function () {
    if (currentStep > 0) {
      currentStep -= 1;
      updateStepUI();
    }
  });

  nextBtn.addEventListener('click', function () {
    if (!validateCurrentStep()) return;
    currentStep += 1;
    updateStepUI();
  });

  form.addEventListener('input', updateReview);
  form.addEventListener('change', updateReview);
  form.addEventListener('reset', function () {
    currentStep = 0;
    updateStepUI();
  });
  updateStepUI();
})();
/* ===== ADMISSION STEP NAV END ===== */


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



(function () {
    var section = document.querySelector('#enrol');
    if (!section) return;

    var journey = section.querySelector('.jr');
    var path = section.querySelector('#jp');
    var car = section.querySelector('#jc');
    var nodes = section.querySelectorAll('.nd');

    if (!journey || !path || !car) return;

    var X = [125, 375, 625, 875];
    var length = path.getTotalLength();
    var visible = false;
    var reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    var startTime = performance.now();

    // Observe when the enrol section enters the viewport
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            visible = entries[0].isIntersecting;

            if (visible) {
                journey.classList.add('in');
            }
        }, {
            threshold: 0.15
        });

        observer.observe(journey);
    } else {
        visible = true;
        journey.classList.add('in');
    }

    // Animate the car along the SVG path
    function animate(time) {
        if (visible || reducedMotion) {
            var progress = reducedMotion
                ? 1
                : ((time - startTime) % 9000) / 9000;

            var point = path.getPointAtLength(
                progress * length
            );

            car.setAttribute(
                'transform',
                'translate(' + point.x + ',' + point.y + ')'
            );

            nodes.forEach(function (node, index) {
                node.classList.toggle(
                    'act',
                    point.x >= X[index] - 4
                );
            });
        }

        if (!reducedMotion) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
})();
