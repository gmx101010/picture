let originalImage = null; // Will hold the original image
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const errorContainer = document.getElementById('errorContainer');

function showError(message) {
    errorContainer.textContent = message;
}

// function drawImageWithAspectRatio(aspectRatio) {
//     if (!originalImage) return;

//     // Clear any previous error messages
//     showError('');

//     // Clear the canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Determine the new dimensions based on aspect ratio
//     let newWidth, newHeight;
//     if (originalImage.width / originalImage.height > aspectRatio) {
//         newWidth = originalImage.width;
//         newHeight = originalImage.width / aspectRatio;
//     } else {
//         newHeight = originalImage.height;
//         newWidth = originalImage.height * aspectRatio;
//     }

//     // Set canvas size to new dimensions
//     canvas.width = newWidth;
//     canvas.height = newHeight;

//     // Draw the original image centered on canvas
//     const xOffset = (newWidth - originalImage.width) / 2;
//     const yOffset = (newHeight - originalImage.height) / 2;
//     ctx.drawImage(originalImage, xOffset, yOffset);
// }

function drawImageWithAspectRatio(aspectRatio) {
    if (!originalImage) return;
  
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Calculate the best fit size for the image within the canvas
    let scaleFactor = Math.min(canvas.width / originalImage.width, canvas.height / originalImage.height);
    let newWidth = originalImage.width * scaleFactor;
    let newHeight = originalImage.height * scaleFactor;
  
    // If the aspect ratio of the image does not match the selected aspect ratio, adjust it
    if (newWidth / newHeight > aspectRatio) {
      newWidth = newHeight * aspectRatio;
    } else if (newWidth / newHeight < aspectRatio) {
      newHeight = newWidth / aspectRatio;
    }
  
    // Calculate the position to draw the image on the canvas
    const x = (canvas.width - newWidth) / 2;
    const y = (canvas.height - newHeight) / 2;
  
    // Fill the canvas with a white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the image centered on the canvas
    ctx.drawImage(originalImage, x, y, newWidth, newHeight);
  }
  
  
async function sendImageToAI() {
    // Clear any previous error messages
    showError('');

    console.log('Sending image to AI service...');
    // This is where you would use fetch() to send the image to the AI service
    // For demonstration purposes, we're just logging to the console.
}

document.getElementById('aspectRatio').addEventListener('change', function(event) {
    const aspectRatio = parseFloat(event.target.value);
    drawImageWithAspectRatio(aspectRatio);
});

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file.type.match('image.*')) {
        showError('Please select an image file (jpg or png).');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        originalImage = new Image();
        originalImage.onload = function() {
            drawImageWithAspectRatio(parseFloat(document.getElementById('aspectRatio').value));
        };
        originalImage.onerror = function() {
            showError('There was an error loading the image.');
        };
        originalImage.src = e.target.result;
    };
    reader.onerror = function() {
        showError('There was an error reading the file.');
    };
    reader.readAsDataURL(file);
});

document.getElementById('fillSpace').addEventListener('click', sendImageToAI);
// ...其他JavaScript代码...

// 获取调整大小的控制点
const resizeHandle = document.getElementById('resizeHandle');
let isResizing = false;

// 当用户点击控制点时开始监听mousemove和mouseup事件
resizeHandle.addEventListener('mousedown', function(e) {
  e.preventDefault();
  isResizing = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
});

function handleResize(e) {
  if (isResizing) {
    // 计算新的尺寸
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const rect = canvas.getBoundingClientRect();
    const newWidth = mouseX - rect.left;
    const newHeight = mouseY - rect.top;
    const aspectRatio = originalImage.naturalWidth / originalImage.naturalHeight;
    
    // 更新canvas的尺寸
    canvas.width = newWidth;
    canvas.height = newWidth / aspectRatio;
    
    // 重新绘制图片
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    
    // 更新控制点的位置
    resizeHandle.style.bottom = '0px';
    resizeHandle.style.right = '0px';
  }
}

function stopResize() {
  // 停止调整大小
  isResizing = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

// 加载并显示图片
// 
document.getElementById('fillSpace').addEventListener('click', function() {
    // 模拟发送请求到AI服务
    console.log('Calling AI service to fill the space...');
  
    // 假设AI服务响应了，并返回了一个新的图片URL
    // 在这里，我们将简单地重新加载同一张图片来模拟这个过程
    // 在实际应用中，您将需要处理和显示从AI服务返回的真实响应
    const aiServiceResponse = originalImage.src; // 这里应该是新的图片URL
  
    // 模拟异步操作，比如使用setTimeout
    setTimeout(() => {
      console.log('AI service responded with a new image.');
      // 假设AI处理完毕并返回了新图片的URL，加载新图片
      loadImageIntoCanvas(aiServiceResponse);
    }, 1500); // 延迟1.5秒来模拟网络延迟
  });
  
  function loadImageIntoCanvas(url) {
    originalImage = new Image();
    originalImage.onload = function() {
      // Set the canvas dimensions to the image dimensions
      canvas.width = originalImage.naturalWidth;
      canvas.height = originalImage.naturalHeight;
      // Draw the image
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);
    }
    originalImage.src = url;
  }
  

// 假设用户通过input选择了一个图片文件
document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(event) {
    loadImageIntoCanvas(event.target.result);
  }
  reader.readAsDataURL(file);
});
