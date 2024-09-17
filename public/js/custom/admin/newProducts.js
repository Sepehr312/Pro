const sliderContainer = document.getElementById("sliderContainer");
const addUploadBtn = document.getElementById("addUploadBtn");
const largePreviewImage = document.getElementById("largePreviewImage");
const placeholderImage = "https://via.placeholder.com/250x250";
let currentImageSrc = null; // برای ردیابی تصویر بزرگ فعلی
const uploadedImages = []; // آرایه‌ای برای ذخیره اطلاعات تصاویر

// تابع برای به‌روزرسانی تصویر بزرگ
function updateLargePreview(src) {
  if (src) {
    largePreviewImage.src = src;
    largePreviewImage.style.display = "block";
    currentImageSrc = src;
  } else {
    largePreviewImage.src = placeholderImage;
    largePreviewImage.style.display = "block";
    currentImageSrc = null;
  }
}

// آپلود تصویر از طریق AJAX
function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file); 

  return fetch("/admin/products/uploderproductsimage", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("تصویر با موفقیت آپلود شد:", data);
      return data.filePath; // برگرداندن مسیر فایل آپلود شده
    })
    .catch((error) => {
      console.error("خطا در آپلود تصویر:", error);
    });
}

// حذف تصویر از سرور از طریق AJAX
function deleteImage(filePath) {
  return fetch("/admin/products/deleteproductsimage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filePath }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("تصویر با موفقیت حذف شد:", data);
    })
    .catch((error) => {
      console.error("خطا در حذف تصویر:", error);
    });
}

// مدیریت حذف تصویر و به‌روزرسانی پیش‌نمایش
function handleDelete(button, filePath) {
  button.addEventListener("click", function (event) {
    event.stopPropagation(); // جلوگیری از رویداد کلیک

    deleteImage(filePath).then(() => {
      const parentContainer = button.parentElement;
      const imageSrc = parentContainer.querySelector("img").src;

      // حذف تصویر از آرایه
      const index = uploadedImages.findIndex(img => img.filePath === filePath);
      if (index > -1) {
        uploadedImages.splice(index, 1);
      }

      // حذف کانتینر تصویر
      parentContainer.remove();

      // به‌روزرسانی پیش‌نمایش بزرگ
      if (currentImageSrc === imageSrc) {
        const remainingImages = sliderContainer.querySelectorAll(
          ".small-upload-container img"
        );
        if (remainingImages.length > 0) {
          updateLargePreview(remainingImages[0].src);
        } else {
          updateLargePreview(null);
        }
      }
    });
  });
}

// اضافه کردن تصاویر جدید
addUploadBtn.addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.addEventListener("change", function () {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      uploadImage(file).then((filePath) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const newUploadContainer = document.createElement("div");
          newUploadContainer.classList.add("small-upload-container");

          const img = document.createElement("img");
          img.src = e.target.result;
          newUploadContainer.appendChild(img);

          const deleteBtn = document.createElement("button");
          deleteBtn.classList.add("delete-btn");
          deleteBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
          handleDelete(deleteBtn, filePath); // حذف تصویر
          newUploadContainer.appendChild(deleteBtn);

          newUploadContainer.addEventListener("click", function () {
            updateLargePreview(e.target.result);
          });

          sliderContainer.insertBefore(newUploadContainer, addUploadBtn);
          updateLargePreview(e.target.result);

          // اضافه کردن اطلاعات تصویر به آرایه
          uploadedImages.push({ filePath, filename: file.name });
        };
        reader.readAsDataURL(file);
      });
    }
  });

  fileInput.click();
});

// ارسال داده‌های فرم به سرور
document.getElementById("sort-btn").addEventListener("click", function () {
  const productName = document.getElementById("productName").value;
  const productDescription = document.getElementById("productDescription").value;
  const productPrice = document.getElementById("productPrice").value;
  const productCategory = document.getElementById("productCategory").value;

  const productData = {
    name: productName,
    description: productDescription,
    price: productPrice,
    category: productCategory,
    images: uploadedImages, // آرایه تصاویر
  };

  fetch("/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("محصول با موفقیت ثبت شد:", data);
      // پیام موفقیت
    })
    .catch((error) => {
      console.error("خطا در ثبت محصول:", error);
      // پیام خطا 
    }); 
});

// پیش‌نمایش اولیه تصویر
updateLargePreview(null);
  