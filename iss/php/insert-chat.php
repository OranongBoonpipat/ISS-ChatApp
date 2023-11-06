<?php 
    session_start(); // เริ่มเซสชันหรือเช็คสถานะเซสชัน
    if(isset($_SESSION['unique_id'])){ // ตรวจสอบว่ามีตัวแปรเซสชัน 'unique_id' ถูกตั้งค่าหรือไม่ (ใช้เพื่อตรวจสอบว่าผู้ใช้ลงชื่อเข้าใช้ระบบหรือยัง)
        include_once "config.php"; // เรียกไฟล์ "config.php" เพื่อเชื่อมต่อกับฐานข้อมูล

        $outgoing_id = $_SESSION['unique_id']; // ดึงค่า 'unique_id' จากเซสชันและเก็บไว้ในตัวแปร $outgoing_id
        $incoming_id = mysqli_real_escape_string($conn, $_POST['incoming_id']); // ดึงค่า 'incoming_id' จากข้อมูลที่ส่งมาผ่าน POST และทำการหนี้ตัวอักษรพิเศษในคำสั่ง SQL โดยใช้ mysqli_real_escape_string
        $message = mysqli_real_escape_string($conn, $_POST['message']); // ดึงค่า 'message' จากข้อมูลที่ส่งมาผ่าน POST และทำการหนี้ตัวอักษรพิเศษในคำสั่ง SQL โดยใช้ mysqli_real_escape_string

        if(!empty($message)){ // ตรวจสอบว่าค่าตัวแปร $message ไม่ว่างเปล่า
            $sql = mysqli_query($conn, "INSERT INTO messages (incoming_msg_id, outgoing_msg_id, msg)
                                        VALUES ({$incoming_id}, {$outgoing_id}, '{$message}')") or die(); // ทำการสร้างคำสั่ง SQL เพื่อเพิ่มข้อความลงในฐานข้อมูล
        }
    }else{
        header("location: ../login.php"); // ถ้าไม่มีเซสชัน 'unique_id' จะเปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ (login.php)
    }
?>
