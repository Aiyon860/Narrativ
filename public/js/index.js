  /* -----> Error Message <----- */
  $(".ok-error-button .bg-error-color").on("click", () => {
    $(".error-message").remove();
  });
  /* -----> End <----- */

  /* -----> Header <----- */
  let prevWidth = 0;

  const addOrRemoveSearchInput = () => {
    if (window.innerWidth < 769) {
      if (window.innerWidth < 425) {
        $("span.product-name").remove();
      }
      $("#search-blog").addClass("d-none");
    } else {
      $("#search-blog").removeClass("d-none");
      $("#product-logo").html(`<img src="/images/general/book-open.png" alt="web logo" width="48"><span class="product-name h1 montserrat-extra-bold mb-0 text-white">Narrativ</span>`);
    }

    if (prevWidth < 376 && (window.innerWidth > 424 && window.innerWidth < 769)) {
      $("#product-logo").html(`<img src="/images/general/book-open.png" alt="web logo" width="48"><span class="product-name h1 montserrat-extra-bold mb-0 text-white">Narrativ</span>`);
    }
    
    prevWidth = window.innerWidth;
  };

  addOrRemoveSearchInput();

  $(window).on("resize", addOrRemoveSearchInput);

  const changingHeaderIcon = () => {
    if (window.innerWidth < 769) {
      $("button#new-post-button").html(`<i id="new-post-button-text" class="fa fa-plus"></i>`);
      $("i#new-post-button-text").removeClass("fa-plus");
      $("i#new-post-button-text").addClass("fa-bars");
    } else {
      $("button#new-post-button").html(`<i id="new-post-button-text" class="fa fa-bars me-1"></i>New Post`);
      $("i#new-post-button-text").removeClass("fa-bars");
      $("i#new-post-button-text").addClass("fa-plus");
    }
  };

  changingHeaderIcon();

  $(window).on("resize", changingHeaderIcon);
  /* -----> End <----- */

  /* -----> XX characters remaining (Create/Update Blog) <----- */
  $("#title-blog[type=text]").on("keyup keydown load popstate", updateCount);

  function updateCount() {
    const amount = $(this).val().length;
    const characterLeft = 60 - (amount <= 60 ? amount : 60);
    let colorNew = "characters-remaining-";

    if (characterLeft > 15) {
      colorNew += "green";
    } else if (characterLeft > 0) {
      colorNew += "yellow";
    } else {
      colorNew += "red";
    }

    const label = Array.from(document.querySelector("#label-below-title").classList).filter((cls) => cls.match(/\bcharacters-remaining-\S*/));

    $("#label-below-title").removeClass(label);
    $("#label-below-title").addClass(colorNew);

    $("#character-count").text(characterLeft)
    $("#word-characters").text("character" + (characterLeft === 1 ? '' : 's'))
  }
  /* -----> End <----- */

  /* -----> Upload Image and Drag and Drop Feature <----- */
  let isErrorFileLimitOccured = false;

  // Click
  $("input#featured-image-blog").on("click", (e) => e.stopPropagation()); // to prevent maximum call stack exceeded caused by calling the parent's click behavior

  $("#image-input-container").on("click", (e) => {
    if (!isErrorFileLimitOccured) {
      $("input#featured-image-blog").trigger("click");
    }
  });

  // Drag and Drop
  // Prevent the default behavior when a file is dragged over the container
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    $("#image-input-container").on(eventName, preventDefaults);
  });

  const fileTypes = ["png", "jpg", "jpeg"];

  const showfileLimitError = () => {
    isErrorFileLimitOccured = true;

    $("#no-image-attached-container").addClass("d-none");
    
    const errorInnerContainer = document.createElement("div");
    errorInnerContainer.id = "error-icon-title-container";
    
    const errorIcon = document.createElement("img");
    errorIcon.id = "error-file-limit-img";
    errorIcon.src = "/images/create-update/error.png";
    errorIcon.classList.add("mb-1", "me-2");
    errorIcon.loading = "eager";
    
    const errorTitle = document.createElement("label");
    errorTitle.classList.add("open-sans-bold", "text-center", "error-color");
    errorTitle.textContent = "File Size Exceeds Limit";
    
    const errorDescription = document.createElement("label");
    errorDescription.classList.add("form-text", "open-sans-regular");
    errorDescription.textContent = "The image you're trying to upload is larger than 10MB. Please reduce the file size or choose a smaller image and try again.";
    
    errorInnerContainer.appendChild(errorIcon);
    errorInnerContainer.appendChild(errorTitle);
    errorInnerContainer.appendChild(errorDescription);

    const errorContainer = document.querySelector("#file-limit-error");
    
    errorContainer.appendChild(errorInnerContainer);

    $("#close-button-create-update-container").removeClass("d-none");
  };

  $("#featured-image-blog").on("change", (e) => {
    if (e.target.files.length === 0) {
      showfileLimitError();
      return;
    }

    const file = e.target.files[0];

    const [fileName, fileExtension] = file.name.split('.');
    const fileSize = file.size;
    const sizeNew = fileSize / 1000;

    if (sizeNew > 102_400) {
      showfileLimitError();
      return;
    }

    const reader = new FileReader(); 

    // event that will be triggered after the read-file operation is completed
    reader.onload = (e) => {
      if (!$("#no-image-attached-container").hasClass("d-none")) {
        $("#no-image-attached-container").addClass("d-none");
        $("#close-button-create-update-container").removeClass("d-none");

        const padding = Array.from(document.querySelector("#image-input-container-middle").classList).filter((cls) => cls.match(/\bpy-\S*/));

        $("#image-input-container-middle").removeClass(padding);
        $("#image-input-container-middle").addClass("py-2");
      }

      const base64 = document.querySelector("input[name=base64image]");
      const size = document.querySelector("input[name=imageSize]");
      const sizeUnit = document.querySelector("input[name=imageSizeUnit]");

      // reset the content
      $("#image-attached-container").html('');

      const imagePreview = document.createElement("img");
      imagePreview.id  = fileName;
      imagePreview.src = e.target.result;

      base64.value    = e.target.result;
      size.value      = (sizeNew > 1024 ? (sizeNew / 1000).toFixed(1) : Math.round(sizeNew));
      sizeUnit.value  = (sizeNew > 1024 ? "mb" : "kb");

      imagePreview.classList.add("preview-image", "img-fluid", "mb-1", "rounded-4", "mt-1");
      imagePreview.loading = "lazy";

      const imageDescription = document.createElement("p");
      imageDescription.classList.add("form-text", "open-sans-regular", "mb-1", "text-center");
      imageDescription.textContent = `${fileName}.${fileExtension} - ${size.value}${sizeUnit.value}`;

      const imageInputContainer = document.querySelector("#image-attached-container");
      imageInputContainer.appendChild(imagePreview);
      imageInputContainer.appendChild(imageDescription);
    };

    reader.readAsDataURL(file);  // reads the contents of the file. When the read operation is finished, the reader.result contains the data as a data URL.
  });

  const imagePreviewContainer = document.querySelector("#image-input-container");
  if (imagePreviewContainer) {
    imagePreviewContainer.addEventListener("drop", (e) => {
      if (!isErrorFileLimitOccured) {
        const files = e.dataTransfer.files;
        document.querySelector("#featured-image-blog").files = files;
        $("#featured-image-blog").trigger("change");
      }
    });
  }

  /* -----> End <----- */

  /* -----> Close Button on Featured Image and Error File Limit <----- */
  $("#close-button-featured-image-or-error").on("click", (e) => {
    $("#image-attached-container").html('');
    $("#file-limit-error").html('');

    $("#no-image-attached-container").removeClass("d-none");
    $("#close-button-create-update-container").addClass("d-none");

    const padding = Array.from(document.querySelector("#image-input-container-middle").classList).filter((cls) => cls.match(/\bpy-\S*/));

    $("#image-input-container-middle").removeClass(padding);
    $("#image-input-container-middle").addClass("py-4");

    isErrorFileLimitOccured = false;

    e.stopPropagation();
  });
  /* -----> End <----- */

  /* -----> Adjust Ellipsis Icon Container to Fit with Content Inside <----- */
  const adjustEllipsisContainer = () => {
    const container = document.querySelectorAll(".ellipsis-container");
    const icon = document.querySelectorAll(".fa-ellipsis-v");

    for (let i = 0; i < container.length; i++) {
      const iconRect = icon[i].getBoundingClientRect();
      const iconSize = Math.max(iconRect.width, iconRect.height);

      const containerSize = iconSize + 10; // 10 (padding) * 2;

      container[i].style.width = `${containerSize}px`;
    }
  };

  window.addEventListener("load", adjustEllipsisContainer);
  window.addEventListener("resize", adjustEllipsisContainer);
  /* -----> End <----- */

  /* -----> Add Dropdown Animation and Logics on The Ellipsis Button <----- */
  const ellipsisContainer = document.querySelectorAll(".ellipsis-container");
  const options = document.querySelectorAll(".edit-delete-container");

  for (let i = 0; i < ellipsisContainer.length; ++i) {
    ellipsisContainer[i].addEventListener("click", () => {
      options[i].classList.toggle("active");
    });
  }

  document.addEventListener("click", (e) => {
    for (let i = 0; i < ellipsisContainer.length; ++i) {
      if (!ellipsisContainer[i].contains(e.target) && !options[i].contains(e.target)) {
        options[i].classList.remove("active");
      }
    }
  });
  /* -----> End <----- */

  /* -----> Showing and Closing Confirmation Message Before Delete Blog <----- */
  const searchIdBlogRegex = () => {
    const regex = /id-blog/;
    const htmlElements = document.querySelectorAll('*');
    const output = [];

    for (let i of htmlElements) {
      if (regex.test(i.id)) {
        if (i.textContent) {
          output.push(i.textContent);
        }
      }
    }

    return output;
  };

  const confirmMsg = document.querySelector(".confirmation-message");
  const body = document.querySelector("body");

  const deleteOptBtn = document.querySelectorAll(".delete-container");

  const blogIdConfirmMsg = document.getElementById("blog-id-confirmation-message");
  const blogTitleConfirmMsg = document.getElementById("blog-title-confirmation-message");
  const blogTitleThumbnails = document.querySelectorAll(".blog-title-thumbnail a");

  const blogIdArr = searchIdBlogRegex();

  for (let i = 0; i < deleteOptBtn.length; ++i) {
    deleteOptBtn[i].addEventListener("click", () => {
      confirmMsg.classList.remove("d-none");
      body.classList.add("overflow-hidden");
      options[i].classList.toggle("active");
      blogIdConfirmMsg.textContent = blogIdArr[i];
      blogTitleConfirmMsg.textContent = blogTitleThumbnails[i].textContent;
    });
  }

  // ----- //

  const closeConfirmMsg = document.querySelector("#close-confirm-deletion-button #close-icon");

  const closingConfirmMsg = () => {
    confirmMsg.classList.add("d-none");
    body.classList.remove("overflow-hidden");
  };

  if (closeConfirmMsg) {
    closeConfirmMsg.addEventListener("click", closingConfirmMsg);
  }

  // ----- //

  const cancelConfirmBtn = document.querySelector("#bg-cancel-confirmation");

  if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener("click", closingConfirmMsg);
  }
  /* -----> End <----- */

  /* -----> Adding Zoom Animation According to User's Cursor Position on The Image Thumbnail <----- */
  const imageInnerContainer = document.querySelectorAll('.img-inner-container');
  const image = document.querySelectorAll(".actual-image-thumbnail");
  const ZOOM_LEVEL = 1.5;

  if (imageInnerContainer && image) {
    for (let i = 0; i < imageInnerContainer.length; ++i) {
      imageInnerContainer[i].addEventListener("mousemove", (e) => {
        const rect = imageInnerContainer[i].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = imageInnerContainer[i].clientWidth / 2;
        const centerY = imageInnerContainer[i].clientHeight / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const transformX = -percentX * 25; // Adjust this value to control horizontal movement
        const transformY = -percentY * 25; // Adjust this value to control vertical movement
        
        image[i].style.transform = `translate(${transformX}px, ${transformY}px) scale(${ZOOM_LEVEL})`;
      });
      
      imageInnerContainer[i].addEventListener("mouseleave", () => {
        image[i].style.transform = "translate(0, 0) scale(1)";
      });
    }
  }
  /* -----> End <----- */

  /* -----> Adding Carousel Item Based on Size of The Browser <-----  */
  // let say the initial amount of read-next blogs are 6.
  // in phone = 6 rows, tablet = 3 rows, laptop = 2 rows;
  const rowComponent = document.createElement("div");
  rowComponent.classList.add("carousel-item");
  rowComponent.innerHTML = `<div class="container">
                              <div class="row g-5 w-75 mx-auto d-flex justify-content-center row-blogs">
                              </div>
                            </div>`;
                          
  const rowsInfo = { amount: 0, maxComponentPerRow: 1 };

  const addCarousel = () => {
    const carousel = document.getElementById("myCarousel");

    if (!carousel) {
      return;
    }

    const currentUserBlogAmount = parseFloat(document.getElementById("user-blog-amount").textContent);

    const width = window.innerWidth;

    if (width >= 1440) {
      rowsInfo.amount = Math.ceil(currentUserBlogAmount / 3);
      rowsInfo.maxComponentPerRow = 3;
    } else if (width <= 1440 && width >= 768) {
      rowsInfo.amount = Math.ceil(currentUserBlogAmount / 2)
      rowsInfo.maxComponentPerRow = 2;
    } else {
      rowsInfo.amount = currentUserBlogAmount;
    }

    const innerCarouselContainer = document.querySelectorAll(".carousel-inner")[0];

    if (innerCarouselContainer.hasChildNodes) {
      innerCarouselContainer.innerHTML = "";
    }

    const carouselIndicator = document.querySelectorAll(".carousel-indicators")[0];

    if (carouselIndicator.hasChildNodes) {
      carouselIndicator.innerHTML = "";
    }

    const blogId = document.getElementById("id-blog-view");

    console.log(rowsInfo);

    for (let i = 0; i < rowsInfo.amount; ++i) {
      const childIndicator = document.createElement("button");
      childIndicator.setAttribute("data-bs-target", "#myCarousel");
      childIndicator.setAttribute("data-bs-slide-to", `${i}`);
      childIndicator.setAttribute("class", (i === 0 ? "active" : ""));
      childIndicator.setAttribute("aria-label", `Slide ${i + 1}`);
      
      carouselIndicator.appendChild(childIndicator);
      innerCarouselContainer.appendChild(rowComponent.cloneNode(true));
      
      const rowBlogs = document.querySelectorAll(".row-blogs");

      for (let j = 0; j < (rowsInfo.maxComponentPerRow > currentUserBlogAmount ? currentUserBlogAmount : rowsInfo.maxComponentPerRow); ++j) {
        if (j + 1 === blogId) {
          continue;
        }

        const blogComponentOnRows = document.createElement("div");
        blogComponentOnRows.classList.add("col-12", "col-md-6", "col-xl-4", "read-next-blog");
        blogComponentOnRows.innerHTML = `<div class="card border-0 bg-transparent">
                                          <div class="img-container position-relative">
                                            <div class="img-inner-container position-relative overflow-hidden rounded-4">
                                              <img src="<%= blogs[${i}]._data.image.base64image %>" class="actual-image-thumbnail card-img-top rounded-4" alt="image">
                                            </div>
                                          </div>
                              
                                          <div class="card-body px-0">
                                            <h3 class="read-next-blog-title card-title montserrat-bold mb-3 d-inline-block"><%= blogs[${i}]._data.title %></h3>
                                            <h6 class="read-next-blog-subtitle card-subtitle mb-3 text-muted open-sans-regular"><%= blogs[${i}]._data.subtitle %></h6>
                                            <p class="read-next-blog-author card-text open-sans-semi-bold">By <%= blogs[${i}]._data.author.name %></p>
                                          </div>
                                        </div>`;

        rowBlogs[i].appendChild(blogComponentOnRows);
      }
    
      if (i === 0) {
        const itemCarousel = document.querySelectorAll(".carousel-item")[i];
        itemCarousel.classList.add("active");
      }
    }
  };

  window.addEventListener("load", addCarousel);
  window.addEventListener("popstate", addCarousel);
  window.addEventListener("resize", addCarousel);
  /* -----> End <----- */

  /* -----> Remove Rest Part of The "Read Next" Section <----- */
  const removeGridPartReadNext = () => {
    const emptyComponent = document.querySelector(".rest-part-read-next");

    if (!emptyComponent) {
      return;
    }

    if (window.innerWidth <= 426) {
      emptyComponent.classList.add("d-none");
    } else {
      emptyComponent.classList.remove("d-none");
    }
  };

  window.addEventListener("resize", removeGridPartReadNext);
  /* -----> End <----- */

  /* -----> Adjust "Back-to-Top" Container <----- */
  const adjustBackToTopContainer = (e) => {
    const container = document.querySelectorAll(".back-to-top-home")[0] || document.querySelectorAll(".back-to-top-view-blog")[0];
    const icon = document.querySelector('i.fa-chevron-up');

    if (!container || !icon) {
      return;
    }
    
    // Set a minimum size for the container
    const minSize = 40;  // in pixels
    
    // Get the size of the icon
    const iconRect = icon.getBoundingClientRect();
    const iconSize = Math.max(iconRect.width, iconRect.height);
    
    // Add some padding
    const padding = 10;
    const containerSize = Math.max(iconSize + (padding * 2), minSize);
    
    // Set the container size
    container.style.width = `${containerSize}px`;
    container.style.height = `${containerSize}px`;
  }

  /*
  * This "popstate" event is fired when navigating through the browser's history, including when using the browser's back and forward buttons or when manipulating the history programmatically.
  * This event listener will trigger whenever the active history entry changes, which includes:
  * 1. Clicking the browser's back or forward buttons
  * 2. Calling history.back(), history.forward(), or history.go()
  * 3. Calling history.pushState() or history.replaceState()
  */
  window.addEventListener("popstate", adjustBackToTopContainer);
  window.addEventListener("load", adjustBackToTopContainer);
  window.addEventListener("resize", adjustBackToTopContainer);
  /* -----> End <----- */

  /* -----> Going All The Way Up <----- */
  const btn = document.querySelectorAll(".back-to-top-home")[0] || document.querySelectorAll(".back-to-top-view-blog")[0];

  if (btn) {
    btn.addEventListener("click", (e) => window.scrollTo(0, 0));
  }

  /* -----> End <----- */

  /* -----> Remove Back-To-Top Button at Certain Breakpoints <----- */
  const removeBackToTop = () => {
    const btn = document.querySelectorAll(".back-to-top-home")[0] || document.querySelectorAll(".back-to-top-view-blog")[0];
    
    if (!btn) {
      return;
    }
    
    if (window.innerWidth < 768) {
      btn.classList.add("d-none");
    } else {
      btn.classList.remove("d-none");
    }
  };

  window.addEventListener("load", removeBackToTop);
  window.addEventListener("resize", removeBackToTop);
  /* -----> End <----- */

  /* -----> Delete Post <----- */
  $("#bg-delete-confirmation").on("click", () => {
    // alert("Deleting blog...."); // TODO: will change later

    $.ajax({
      url: `/posts/${$(`#blog-id-confirmation-message`).text()}`,
      method: "DELETE",
      success: function (response) {
        window.location.href = '/';
      }
    });
  });
  /* -----> End <----- */

  /* -----> Edit Post <----- */
  const editContainers = $(".editContainers");

  for (let i = 0; i < editContainers.length; ++i) {
    editContainers[i].on("click", () => {
      const url = `/posts/${blogIdArr[i]}/edit`;
      $.ajax({
        url,
        method: "GET",
        success: function (response) {
          window.location.href = url;
        }
      });
    });
  }
  /* -----> End <----- */

  /* -----> Adding Value to Text Area (Editing Mode) <----- */
  const contentEditBlog = document.getElementById("content-blog-edit");
  const contentEditBlogTemp = document.getElementById("content-edit-temp");

  if (contentEditBlog && contentEditBlogTemp) {
    contentEditBlog.value = contentEditBlogTemp.textContent;
  }
  /* -----> End <----- */

  /* -----> Selecting Category (Editing Mode) <----- */
  let categoryOptions = document.getElementById("category-select");
  const selectedCategory = document.querySelectorAll(".category-edit-temp")[0];

  if (categoryOptions && selectedCategory) {
    categoryOptions = document.getElementById("category-select").options;
    for (let i = 0; i < categoryOptions.length; ++i) {
      if (categoryOptions[i].value === selectedCategory.textContent) {
        categoryOptions[i].selected = true;
        break;
      }
    }
  }
  /* -----> End <----- */

  /* -----> Adding Image Preview (Editing Mode) <----- */
  const addingImagePreviewOnEditMode = () => {
    if (!$("#no-image-attached-container").hasClass("d-none")) {
      $("#no-image-attached-container").addClass("d-none");
      $("#close-button-create-update-container").removeClass("d-none");
    
      const padding = Array.from(document.querySelector("#image-input-container-middle").classList).filter((cls) => cls.match(/\bpy-\S*/));
    
      $("#image-input-container-middle").removeClass(padding);
      $("#image-input-container-middle").addClass("py-2");
    }
    
    const [
      base64,
      inputBase64, 
      fileName, 
      fileExtension, 
      fileSize, 
      fileSizeUnit
    ] = [
      document.getElementById("image-base64image"), 
      document.querySelector("input[name=base64image]"),
      document.getElementById("image-name-edit"), 
      document.getElementById("image-file-extension-edit"), 
      document.getElementById("image-size-edit"), 
      document.getElementById("image-size-unit-edit")
    ];

    const imagePreview = document.createElement("img");
    imagePreview.id  = fileName.textContent;
    imagePreview.src = base64.textContent;

    inputBase64.value = base64.textContent;

    imagePreview.classList.add("preview-image", "img-fluid", "mb-1", "rounded-4", "mt-1");
    imagePreview.loading = "lazy";

    const imageDescription = document.createElement("p");
    imageDescription.classList.add("form-text", "open-sans-regular", "mb-1", "text-center");
    imageDescription.textContent = `${fileName.textContent}.${fileExtension.textContent} - ${fileSize.textContent}${fileSizeUnit.textContent}`;
      
    const imageInputContainer = document.getElementById("image-attached-container");
    imageInputContainer.appendChild(imagePreview);
    imageInputContainer.appendChild(imageDescription);
  };

  /* -----> Check If The User in The Editing Mode <----- */
  const checkIfEditRoute = (path) => {
    const pathArr = path.split('/');
    return pathArr[pathArr.length - 1] === "edit";
  };

  if (checkIfEditRoute(window.location.pathname)) {
    addingImagePreviewOnEditMode();
  }
  /* -----> End <----- */

  /* -----> Sending "PUT" Request to Edit Blog <----- */
  const putMethod = (e) => {
    e.preventDefault();

    let target = e.target;

    // While the target is not te FORM tag, it looks for the parent element
    while (target.tagName !== "FORM") {
      target = target.parentElement;
    }

    const url = target.getAttribute("action");

    console.log(url);

    const bodyForm = target.querySelectorAll("[name=title], [name=subtitle], [name=content], [name=category], [name=tags], [name=imageTitle], [name=base64image], [name=imageSize], [name=imageSizeUnit]")
    const body = {};

    bodyForm.forEach((element) => {
      const nameAttr = element.getAttribute("name");
      body[`${nameAttr}`] = element.value;
    });

    console.log(body);

    const xhr = new XMLHttpRequest();

    xhr.open("PUT", url);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.onload = () => {
      if (xhr.status === 200) {
        window.location.replace(window.location.pathname.split('/').slice(0, 2).join('/'));
      } else {
        console.log(xhr.status, xhr.response);
      }
    };

    xhr.send(new URLSearchParams(body).toString());
  };

  if (checkIfEditRoute(window.location.pathname)) {
    $("#update-button").on("click", putMethod);
  }
  /* -----> End <----- */