const form = document.querySelector(".typing-area"),  // เลือก HTML element ที่มีคลาส "typing-area" แล้วเก็บในตัวแปร form
incoming_id = form.querySelector(".incoming_id").value, // เลือก HTML element ที่อยู่ใน form ที่มีคลาส "incoming_id" และดึงค่า value ของมัน
inputField = form.querySelector(".input-field"), // เลือก HTML element ที่อยู่ใน form ที่มีคลาส "input-field" และเก็บในตัวแปร inputField
sendBtn = form.querySelector("button"), // เลือก HTML element ปุ่มใน form และเก็บในตัวแปร sendBtn
chatBox = document.querySelector(".chat-box"); // เลือก HTML element ที่มีคลาส "chat-box" และเก็บในตัวแปร chatBox

form.onsubmit = (e) => { // เมื่อฟอร์มถูกส่ง (submit), จะป้องกันการโหลดหน้าใหม่
    e.preventDefault();
}

inputField.focus(); // ให้ focus ไปยัง inputField เมื่อหน้าเว็บโหลด

inputField.onkeyup = () => { // เมื่อผู้ใช้ป้อนข้อความใน inputField
    if (inputField.value != "") { // ถ้ามีข้อความใน inputField
        sendBtn.classList.add("active"); // เพิ่มคลาส "active" ในปุ่ม sendBtn
    } else { // ถ้าไม่มีข้อความใน inputField
        sendBtn.classList.remove("active"); // ลบคลาส "active" จากปุ่ม sendBtn
    }
}

// ฟังก์ชันสำหรับเข้ารหสข้อความด้วย Transposition Cipher
function encryptText(text, key) {
    let result = "";
    for (let i = 0; i < key; i++) {  // วนลูปตามจำนวนรอบที่กำหนดโดย key
        for (let j = i; j < text.length; j += key) {  // วนลูปตามข้อความและบันทึกตัวอักษรที่ถูกสลับตำแหน่ง
            result += text[j];
        }
    }
    return result;  // คืนค่าข้อความที่ถูกเข้ารหัส
    // ตัวอย่าง: ถ้า key = 3 และ text = "HELLO", ผลลัพธ์คือ "HLLEO"
}

// ฟังก์ชันสำหรับถอดรหสข้อความด้วย Transposition Cipher
function decryptText(text, key) {
    let result = Array(text.length);
    let index = 0;
    for (let i = 0; i < key; i++) {  // วนลูปตามจำนวนรอบที่กำหนดโดย key
        for (let j = i; j < text.length; j += key) {  // วนลูปตามข้อความและกำหนดตำแหน่งที่ถูกเรียงลำดับถูกต้อง
            result[j] = text[index];
            index++;
        }
    }
    return result.join("");  // คืนค่าข้อความที่ถูกถอดรหัสและเรียงลำดับถูกต้อง
    // ตัวอย่าง: ถ้า key = 3 และ text = "HLLEO", ผลลัพธ์คือ "HELLO"
}

// วิธีการใช้:
// เรียกใช้ `encryptText` โดยรับพารามิเตอร์ `text` เพื่อข้อความที่ต้องการเข้ารหัสและ `key` ที่จะใช้ในการเข้ารหัส
// ตัวอย่าง: const encrypted = encryptText("HELLO", 3); // ผลลัพธ์คือ "HLLEO"
// เรียกใช้ `decryptText` โดยรับพารามิเตอร์ `text` เพื่อข้อความที่ต้องการถอดรหัสและ `key` ที่ถูกใช้ในการถอดรหัส
// ตัวอย่าง: const decrypted = decryptText("HLLEO", 3); // ผลลัพธ์คือ "HELLO"


sendBtn.onclick = () => { // เมื่อผู้ใช้คลิกที่ปุ่ม sendBtn
    let xhr = new XMLHttpRequest(); // สร้างอ็อบเจกต์ XMLHttpRequest สำหรับการส่งข้อมูลผ่าน HTTP
    xhr.open("POST", "php/insert-chat.php", true); // กำหนดการเชื่อมต่อด้วย POST ไปยัง "php/insert-chat.php" โดยใช้งานแบบ asynchronous
    xhr.onload = () => { // เมื่อการร้องขอเสร็จสิ้น
        if (xhr.readyState === XMLHttpRequest.DONE) { // ตรวจสอบสถานะการร้องขอ
            if (xhr.status === 200) { // ตรวจสอบสถานะ HTTP 200 (OK)
                inputField.value = ""; // ล้างค่าใน inputField
                scrollToBottom(); // เรียกฟังก์ชัน scrollToBottom() เพื่อเลื่อนหน้าเว็บไปที่ด้านล่างสุด
            }
        }
    }
    const text = inputField.value;
    const key = 3; // กำหนดคีย์ของ Transposition Cipher
    const encryptedText = encryptText(text, key);
    // ส่งข้อความที่ถูกเข้ารหัสไปยังเซิร์ฟเวอร์
    let formData = new FormData(form); // สร้างอ็อบเจกต์ FormData จาก form
    formData.append("message", encryptedText);
    xhr.send(formData); // ส่งข้อมูลผ่าน XMLHttpRequest
}

chatBox.onmouseenter = () => { // เมื่อเม้าส์เข้าไปใน chatBox
    chatBox.classList.add("active"); // เพิ่มคลาส "active" ใน chatBox
}

chatBox.onmouseleave = () => { // เมื่อเม้าส์ออกจาก chatBox
    chatBox.classList.remove("active"); // ลบคลาส "active" จาก chatBox
}

setInterval(() => { // สร้างลูปที่ทำงานตลอดเวลา
    let xhr = new XMLHttpRequest(); // สร้างอ็อบเจกต์ XMLHttpRequest สำหรับการร้องขอข้อมูล
    xhr.open("POST", "php/get-chat.php", true); // กำหนดการเชื่อมต่อด้วย POST ไปยัง "php/get-chat.php" โดยใช้งานแบบ asynchronous
    xhr.onload = () => { // เมื่อการร้องขอเสร็จสิ้น
        if (xhr.readyState === XMLHttpRequest.DONE) { // ตรวจสอบสถานะการร้องขอ
            if (xhr.status === 200) { // ตรวจสอบสถานะ HTTP 200 (OK)
                let data = xhr.response; // รับข้อมูลที่ส่งกลับจากเซิร์ฟเวอร์
                // ทำการถอดรหัสข้อมูลที่ได้รับ
                const decryptedData = decryptText(data, 3); // 3 คือคีย์ที่ถูกต้อง
                // แสดงข้อมูลที่ถูดรหัส
                chatBox.innerHTML = data; // แสดงข้อมูลใน chatBox
                if (!chatBox.classList.contains("active")) { // ถ้า chatBox ไม่มีคลาส "active"
                    scrollToBottom(); // เรียกฟังก์ชัน scrollToBottom() เพื่อเลื่อนหน้าเว็บไปที่ด้านล่างสุด
                }
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // กำหนดส่วนหัวของร้องขอ
    xhr.send("incoming_id=" + incoming_id); // ส่งข้อมูล "incoming_id" ผ่าน XMLHttpRequest
}, 500); // ร้องขอข้อมูลทุก 500 มิลลิวินาที

function scrollToBottom() { // ฟังก์ชันเลื่อนหน้าเว็บไปที่ด้านล่างสุด
    chatBox.scrollTop = chatBox.scrollHeight;
}
