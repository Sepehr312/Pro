const sliderContainer = document.getElementById("sliderContainer");
const addUploadBtn = document.getElementById("addUploadBtn");
const largePreviewImage = document.getElementById("largePreviewImage");
const placeholderImage = "https://via.placeholder.com/250x250";
let currentImageSrc = null; // برای ردیابی تصویر بزرگ فعلی
const uploadedImages = []; // آرایه‌ای برای ذخیره نام تصاویر

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
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "تصویر با موفقیت آپلود شد",
          showConfirmButton: false,
          timer: 1500,
        });
        // فقط نام فایل را به آرایه اضافه کنید
        uploadedImages.push(data.data); // فقط نام فایل
        return data.data; // نام فایل برای پیش‌نمایش
      } else {
        Swal.fire({
          icon: "error",
          title: "خطا در آپلود تصویر",
          text: "لطفاً مجدداً تلاش کنید!",
        });
        throw new Error("Error uploading image");
      }
    })
    .catch((error) => {
      console.error("خطا در آپلود تصویر:", error);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "مشکلی در آپلود تصویر رخ داد.",
      });
    });
}

// حذف تصویر از سرور از طریق AJAX
function deleteImage(filename) {
  console.log("Attempting to delete image:", filename); // لاگ برای بررسی نام فایل

  return fetch("/admin/products/deleteproductsimage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filePath: filename }), // ارسال فقط نام فایل
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "File deleted successfully") {
        Swal.fire({
          icon: "success",
          title: "تصویر با موفقیت حذف شد",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        throw new Error(data.message || "Error deleting image");
      }
    })
    .catch((error) => {
      console.error("خطا در حذف تصویر:", error.message);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: error.message || "مشکلی در حذف تصویر رخ داد.",
      });
    });
}

// مدیریت حذف تصویر و به‌روزرسانی پیش‌نمایش
function handleDelete(button, filename) {
  button.addEventListener("click", function (event) {
    event.stopPropagation(); // جلوگیری از رویداد کلیک

    deleteImage(filename).then(() => {
      const parentContainer = button.parentElement;
      const imageSrc = parentContainer.querySelector("img").src;

      // حذف تصویر از آرایه
      const index = uploadedImages.findIndex((img) => img === filename);
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

      uploadImage(file).then((filename) => {
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
          handleDelete(deleteBtn, filename); // حذف تصویر
          newUploadContainer.appendChild(deleteBtn);

          newUploadContainer.addEventListener("click", function () {
            updateLargePreview(e.target.result);
          });

          sliderContainer.insertBefore(newUploadContainer, addUploadBtn);
          updateLargePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  });

  fileInput.click();
});

document.getElementById("sort-btn").addEventListener("click", function () {
  console.log("ثبت محصول کلیک شد");

  // دریافت مقادیر فرم
  const productName = document.getElementById("productName").value;
  const productDescription =
    document.getElementById("productDescription").value;
  const productPrice = document.getElementById("productPrice").value;
  const productCategory = document.getElementById("productCategory").value;

  // اعتبارسنجی داده‌های فرم
  if (
    !productName ||
    !productDescription ||
    !productPrice ||
    !productCategory ||
    uploadedImages.length === 0
  ) {
    Swal.fire({
      icon: "warning",
      title: "لطفاً تمام فیلدها را پر کنید و تصویری انتخاب کنید.",
      showConfirmButton: true,
    });
    return;
  }

  const productData = {
    name: productName,
    description: productDescription,
    price: productPrice,
    category: productCategory,
    images: uploadedImages, // آرایه نام تصاویر
  };

  fetch("/admin/products/addedproducts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        // نمایش خطاها
        console.log("Errors:", data.errors); // نمایش خطاها در کنسول
        Swal.fire({
          icon: "error",
          title: "خطا",
          text:
            data.errors.map((err) => err.message).join("\n") ||
            "مشکلی در ثبت محصول رخ داد.",
        });
      } else {
        // پردازش موفقیت‌آمیز
        Swal.fire({
          icon: "success",
          title: "محصول با موفقیت ثبت شد",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.reload();
        });
      }
    })
    .catch((error) => {
      console.error("خطا در ثبت محصول:", error);
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: error.message || "مشکلی در ثبت محصول رخ داد.",
      });
    });
});

// پیش‌نمایش اولیه تصویر
updateLargePreview(null);
