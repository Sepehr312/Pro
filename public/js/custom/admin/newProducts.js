
    const sliderContainer = document.getElementById("sliderContainer");
    const addUploadBtn = document.getElementById("addUploadBtn");
    const largePreviewImage = document.getElementById("largePreviewImage");
    const placeholderImage = "https://via.placeholder.com/250x250";
    let currentImageSrc = null; // Track the current image source

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

    function handleDelete(button) {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent the click event from bubbling up to the container
            const parentContainer = button.parentElement;
            const imageSrc = parentContainer.querySelector("img").src;

            // Remove the container
            parentContainer.remove();

            // Update large preview after removal
            if (currentImageSrc === imageSrc) {
                const remainingImages = sliderContainer.querySelectorAll(".small-upload-container img");
                if (remainingImages.length > 0) {
                    // Show the first remaining image
                    updateLargePreview(remainingImages[0].src);
                } else {
                    // No images remaining, show placeholder
                    updateLargePreview(null);
                }
            }
        });
    }

    // AJAX function to upload image
    function uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file); // Append the image to the FormData

        // Use fetch to send the image to the server
        fetch("/admin/products/uploderproductsimage", { // Replace with your server URL
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log("Image uploaded successfully:", data);
        })
        .catch(error => {
            console.error("Error uploading image:", error);
        });
    }
    // AJAX function to delete image from server
    function deleteImage(filePath) {
      return fetch("/admin/products/deleteproductsimage", { // Replace with your server URL
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ filePath }) // Send the file path to delete
      })
      .then(response => response.json())
      .then(data => {
          console.log("Image deleted successfully:", data);
      })
      .catch(error => {
          console.error("Error deleting image:", error);
      });
  }
    addUploadBtn.addEventListener("click", function () {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.addEventListener("change", function () {
            if (fileInput.files && fileInput.files[0]) {
                const file = fileInput.files[0]; // Get the selected file
                uploadImage(file); // Call the AJAX upload function

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
                    handleDelete(deleteBtn);
                    newUploadContainer.appendChild(deleteBtn);

                    newUploadContainer.addEventListener("click", function () {
                        updateLargePreview(e.target.result);
                    });

                    sliderContainer.insertBefore(newUploadContainer, addUploadBtn);
                    // Update the large preview to the newly added image
                    updateLargePreview(e.target.result);
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
        });

        fileInput.click();
    });

    // Initialize large preview with placeholder image
    updateLargePreview(null);
