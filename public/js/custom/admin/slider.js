let slideCount = <%- slideFieldData.length || 0 %>;

let currentSlide = 0;

function showPreview(input, index) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const container = document.querySelector(
        `#slidesContainer .slide-form:nth-child(${index}) .upload-container`
      );
      container.innerHTML = `<img src="${e.target.result}" alt="تصویر آپلود شده">`;
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);

    $.ajax({
      url: "/admin/slider/slideruploadimage",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        document.getElementById(`hiddenfile${index}`).value = response.data;
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
      },
    });
  }
}

function submitSlider(input, index) {
  var slidesArray = [];

  for (let i = 1; i <= slideCount; i++) {
      let slideObj = {};

      let slideId = document.querySelector(`#slidesContainer #slideId${i}`).value;
      let image = document.querySelector(`#slidesContainer #hiddenfile${i}`).value;
      let title = document.querySelector(`#slidesContainer #title${i}`).value;
      let description = document.querySelector(`#slidesContainer #description${i}`).value;

      slideObj['id'] = slideId; // افزودن شناسه اسلاید
      slideObj['image'] = image;
      slideObj['title'] = title;
      slideObj['description'] = description;

      slidesArray.push(slideObj);
  }

  console.log(slidesArray);

  $.ajax({
    url: "/admin/slider/updateslides",
    type: "POST",
    data: JSON.stringify(slidesArray),
    contentType: "application/json; charset=utf-8",
    dataType: "json", 
    success: function (response) {
      console.log("Success:", response);
    },
    error: function (xhr, status, error) {
      console.error("Error:", error);
    },
  });
  return;
}


function updateSlideContent(index) {
  // Additional logic can be added here if needed
}

function addSlide() {
  slideCount++;
  const slidesContainer = document.getElementById("slidesContainer");
  const newSlideForm = `
    <div class="slide-form">
      <input type="hidden" id="hiddenfile${slideCount}" />
      <div class="upload-container" onclick="document.getElementById('image${slideCount}').click()">
        <input type="file" id="image${slideCount}" accept="image/*" onchange="showPreview(this, ${slideCount})">
        <span class="add-icon"><i class="fas fa-image"></i></span>
      </div>
      <div class="slide-content">
        <input type="text" id="title${slideCount}" class="form-control" placeholder="عنوان اسلاید" oninput="updateSlideContent(${slideCount})">
        <textarea id="description${slideCount}" class="form-control" placeholder="توضیحات اسلاید" oninput="updateSlideContent(${slideCount})"></textarea>
      </div>
    </div>
  `;
  slidesContainer.insertAdjacentHTML("beforeend", newSlideForm);
  updateIndicator();
  updateButtons();
}

function navigateSlide(direction) {
  currentSlide += direction;
  const slideWidth = document.querySelector(".slide-form").offsetWidth;
  document.getElementById("slidesContainer").style.transform = `translateX(-${currentSlide * slideWidth}px)`;
  updateIndicator();
  updateButtons();
}

function updateIndicator() {
  document.getElementById("slideIndicator").textContent = `صفحه ${currentSlide + 1} از ${slideCount}`;
}

function updateButtons() {
  document.getElementById("prevSlide").disabled = currentSlide === 0;
  document.getElementById("nextSlide").disabled = currentSlide === slideCount - 1;
}

function deleteSlide() {
  if (slideCount > 1) {
    const slidesContainer = document.getElementById("slidesContainer");
    slidesContainer.removeChild(slidesContainer.children[currentSlide]);
    slideCount--;
    if (currentSlide > 0) {
      currentSlide--;
    }
    navigateSlide(0); // Refresh view
  } else {
    alert("نمی‌توانید تنها اسلاید را حذف کنید.");
  }
}

updateButtons();
updateIndicator();