<?php 
    session_start(); // เริ่มเซสชันหรือเช็คสถานะเซสชัน
    if(isset($_SESSION['unique_id'])){ // ตรวจสอบว่ามีตัวแปรเซสชัน 'unique_id' ถูกตั้งค่าหรือไม่ (ใช้เพื่อตรวจสอบว่าผู้ใช้ลงชื่อเข้าใช้ระบบหรือยัง)
        include_once "config.php"; // เรียกไฟล์ "config.php" เพื่อเชื่อมต่อกับฐานข้อมูล

        // ฟังก์ชันสำหรับถอดรหัสข้อความด้วย Transposition Cipher
        function decryptText($text, $key) {
            $result = array_fill(0, strlen($text), ''); // สร้างอาร์เรย์เตรียมรับข้อความถอดรหัส
            $index = 0;
            for ($i = 0; $i < $key; $i++) {  // วนลูปตามจำนวนรอบที่กำหนดโดย key
                for ($j = $i; $j < strlen($text); $j += $key) {  // วนลูปตามข้อความและกำหนดตำแหน่งที่ถูกเรียงลำดับถูกต้อง
                    $result[$j] = $text[$index];
                    $index++;
                }
            }
            return implode('', $result);  // รวมข้อความที่ถูกถอดรหัสเข้าด้วยกันและคืนค่าในรูปแบบข้อความ
        }


        $outgoing_id = $_SESSION['unique_id']; // ดึงค่า 'unique_id' จากเซสชันและเก็บไว้ในตัวแปร $outgoing_id
        $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']); // ดึงค่า 'incoming_id' จากข้อมูลที่ส่งมาผ่าน POST และทำการหนี้ตัวอักษรพิเศษในคำสั่ง SQL โดยใช้ mysqli_real_escape_string
        $output = ""; // เริ่มตัวแปร $output เป็นสตริงเปล่าเพื่อเก็บ HTML ที่จะแสดงผล

        $sql = "SELECT * FROM messages LEFT JOIN users ON users.unique_id = messages.outgoing_msg_id
                WHERE (outgoing_msg_id = {$outgoing_id} AND incoming_msg_id = {$incoming_id})
                OR (outgoing_msg_id = {$incoming_id} AND incoming_msg_id = {$outgoing_id}) ORDER BY msg_id"; // สร้างคำสั่ง SQL ในการดึงข้อมูลข้อความจากฐานข้อมูล โดยใช้การเชื่อมตาราง messages และ users ผ่าน LEFT JOIN

        $query = mysqli_query($conn, $sql); // ทำการส่งคำสั่ง SQL ไปยังฐานข้อมูลและเก็บผลลัพธ์ในตัวแปร $query

        if(mysqli_num_rows($query) > 0){ // ตรวจสอบว่ามีข้อมูลในผลลัพธ์การส่งคำสั่ง SQL
            while($row = mysqli_fetch_assoc($query)){ // วนลูปผ่านแถวข้อมูลที่ดึงมา
                
                // ถอดรหัสข้อความด้วยฟังก์ชัน decryptText
                 $decodedMessage = decryptText($row['msg'], 3); // 3 คือคีย์ที่ถูกต้อง

                if($row['outgoing_msg_id'] === $outgoing_id){ // ตรวจสอบว่าข้อความเป็นของผู้ใช้ปัจจุบันหรือไม่
                    $output .= '<div class="chat outgoing">
                                <div class="details">
                                    <p>'. $row['msg'] .'</p>
                                </div>
                                </div>'; // เพิ่ม HTML สำหรับข้อความออก
                }else{
                    $output .= '<div class="chat incoming">
                                <img src="php/images/'.$row['img'].'" alt="">
                                <div class="details">
                                    <p>'. $row['msg'] .'</p>
                                </div>
                                </div>'; // เพิ่ม HTML สำหรับข้อความขาเข้า
                }
            }
        }else{
            $output .= '<div class="text">No messages are available. Once you send message they will appear here.</div>'; // ถ้าไม่มีข้อความที่ใช้ใช้ในการแสดงผล
        }
        echo $output; // แสดง HTML ผลลัพธ์ผ่าน PHP
    }else{
        header("location: ../login.php"); // ถ้าผู้ใช้ไม่ได้ลงชื่อเข้าใช้ระบบ (เซสชัน 'unique_id' ไม่ถูกตั้งค่า) จะเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ (login.php)
    }
?>
