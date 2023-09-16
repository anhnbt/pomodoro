// PomodoroInfo.js
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Box, Link } from "@mui/material";

function PomodoroInfo() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Phương pháp Pomodoro là gì?
        </Typography>
        <Typography variant="body1" component="blockquote">
          Phương pháp Pomodoro là một phương pháp quản lý thời gian được phát
          triển bởi Francesco Cirillo vào cuối những năm 1980. Nó sử dụng đồng
          hồ bấm giờ trong bếp để chia công việc thành các khoảng thời gian,
          thường là 25 phút, giữa mỗi khoảng một thời gian nghỉ ngơi ngắn. Mỗi
          khoảng thời gian được gọi là một pomodoro, bắt nguồn từ tiếng Ý có
          nghĩa là cà chua, theo tên đồng hồ bấm giờ dùng trong bếp hình quả cà
          chua mà Cirillo đã sử dụng khi còn là sinh viên đại học. —{" "}
          <Link href="https://vi.wikipedia.org/wiki/Ph%C6%B0%C6%A1ng_ph%C3%A1p_Pomodoro">
            Phương pháp Pomodoro, Wikipedia
          </Link>
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom>
          Một số lý do tại sao nên sử dụng kỹ thuật Pomodoro
        </Typography>
        <Box
          sx={{
            px: 2,
          }}
          component="ul"
        >
          <Box component="li">
            <strong>Tăng sự tập trung</strong>: Kỹ thuật Pomodoro yêu cầu bạn
            làm việc hoặc học tập trong khoảng thời gian ngắn và giới hạn
            (thường là 25 phút). Điều này giúp bạn tập trung tối đa vào công
            việc trong khoảng thời gian đó.
          </Box>
          <Box component="li">
            <strong>Giảm căng thẳng và mệt mỏi</strong>: Việc chia công việc
            thành các khoảng thời gian ngắn kết hợp với các khoảng thời gian
            nghỉ ngắn (như 5 phút) hoặc dài hơn (như 15 phút) giúp bạn tránh
            căng thẳng và mệt mỏi.
          </Box>
          <Box component="li">
            <strong>Tăng năng suất</strong>: Pomodoro giúp bạn làm việc hiệu quả
            hơn bằng cách tạo áp lực thời gian. Việc hoàn thành công việc trong
            khoảng thời gian ngắn có thể thúc đẩy bạn hoàn thành nhiều công việc
            hơn trong một ngày.
          </Box>
          <Box component="li">
            <strong>Dễ dàng theo dõi thời gian</strong>: Pomodoro có thời gian
            cố định (25 phút) nên bạn có thể dễ dàng theo dõi thời gian và đánh
            giá tiến độ công việc của mình.
          </Box>
          <Box component="li">
            <strong>Hỗ trợ quản lý thời gian</strong>: Bằng cách sử dụng
            Pomodoro, bạn có thể quản lý thời gian của mình một cách hiệu quả
            hơn. Bạn biết được mình đã làm việc trong bao nhiêu thời gian và có
            thể điều chỉnh thời gian nghỉ để đảm bảo sự cân bằng giữa làm việc
            và thư giãn.
          </Box>
          <Box component="li">
            <strong>Khắc phục tình trạng trì hoãn</strong>: Kỹ thuật Pomodoro
            khuyến khích bạn bắt đầu công việc ngay lập tức và làm việc liên tục
            trong khoảng thời gian Pomodoro. Điều này có thể giúp bạn vượt qua
            tình trạng trì hoãn.
          </Box>
          <Box component="li">
            <strong>Dễ áp dụng</strong>: Pomodoro không đòi hỏi công cụ phức tạp
            hoặc kỹ thuật đặc biệt. Bạn chỉ cần một bộ hẹn giờ hoặc một ứng dụng
            đếm giờ đơn giản để bắt đầu.
          </Box>
          <Box component="li">
            <strong>Cải thiện quản lý dự án</strong>: Pomodoro có thể áp dụng
            cho quản lý dự án để chia dự án thành các nhiệm vụ nhỏ hơn và theo
            dõi tiến trình một cách cụ thể.
          </Box>
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          5 bước sử dụng phương pháp Pomodoro để tăng hiệu suất và quản lý thời
          gian hiệu quả
        </Typography>
        <Box
          sx={{
            px: 2,
          }}
          component="ul"
        >
          <Box component="li">
            <strong>Chọn công việc cần thực hiện</strong>: Bước đầu tiên là xác
            định công việc hoặc nhiệm vụ bạn muốn hoàn thành. Đảm bảo công việc
            này cụ thể và có thể thực hiện trong một khoảng thời gian tương đối
            ngắn.
          </Box>
          <Box component="li">
            <strong>Thiết lập hẹn giờ Pomodoro</strong>: Bắt đầu một đếm giờ
            Pomodoro trong khoảng thời gian tối ưu (thường là 25 phút). Khi bắt
            đầu, tập trung 100% vào công việc mà bạn đã chọn và cố gắng hoàn
            thành nhiệm vụ đó trong khoảng thời gian Pomodoro.
          </Box>
          <Box component="li">
            <strong>Làm việc cho đến khi hết thời gian</strong>: Trong khoảng
            thời gian Pomodoro, làm việc không gián đoạn và tập trung hoàn toàn
            vào công việc. Tránh xem điện thoại, mạng xã hội hoặc bất kỳ sự xao
            lệnh nào khác.
          </Box>
          <Box component="li">
            <strong>Khi Pomodoro kết thúc, nghỉ ngắn</strong>: Sau khi Pomodoro
            kết thúc (ví dụ, sau 25 phút làm việc), hãy chấp nhận một khoảng
            thời gian ngắn nghỉ ngơi (thường là 5 phút). Sử dụng thời gian này
            để thư giãn, đứng dậy, căn chỉnh và chuẩn bị cho Pomodoro tiếp theo.
          </Box>
          <Box component="li">
            <strong>Lặp lại hoặc nghỉ ngắn dài</strong>: Sau khi hoàn thành một
            chu kỳ Pomodoro và nghỉ ngắn, bạn có thể lặp lại bước 2 và 3 cho
            công việc tiếp theo. Sau bốn chu kỳ Pomodoro liên tiếp, bạn có thể
            thực hiện một khoảng nghỉ dài hơn (thường là 15-30 phút) để thư giãn
            hoàn toàn.
          </Box>
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          Sau khi một chu kỳ Pomodoro kết thúc bạn có thể làm gì?
        </Typography>
        <Box
          sx={{
            px: 2,
          }}
          component="ul"
        >
          <Box component="li">
            <strong>Nghỉ ngắn</strong>: Thực hiện một khoảng nghỉ ngắn ngay sau
            khi Pomodoro kết thúc. Thời gian nghỉ ngắn thường là 5 phút. Trong
            khoảng thời gian này, bạn có thể đứng dậy, vận động cơ thể, căn
            chỉnh lại tư duy, và lấy một hơi để sẵn sàng cho Pomodoro tiếp theo.
          </Box>
          <Box component="li">
            <strong>Ghi chép công việc</strong>: Sử dụng thời gian nghỉ ngắn để
            ghi chép công việc đã hoàn thành trong Pomodoro trước đó. Điều này
            giúp bạn theo dõi tiến trình công việc và cải thiện khả năng quản lý
            thời gian.
          </Box>
          <Box component="li">
            <strong>Nghỉ dài (Long Break)</strong>: Sau khi hoàn thành một số
            chu kỳ Pomodoro (thường sau bốn), bạn có thể thực hiện một khoảng
            nghỉ dài hơn, thường là từ 15 đến 30 phút. Trong khoảng thời gian
            này, bạn có thể thư giãn hoàn toàn, ăn một bữa nhẹ, ra ngoài dạo
            chơi, hoặc làm bất kỳ điều gì giúp bạn lấy lại năng lượng.
          </Box>
          <Box component="li">
            <strong>Đánh giá và điều chỉnh</strong>: Sử dụng thời gian nghỉ để
            xem xét công việc bạn đã hoàn thành và xem xét liệu bạn có cần điều
            chỉnh mục tiêu hoặc ưu tiên công việc không. Điều này giúp bạn đảm
            bảo bạn đang làm việc vào hướng đúng.
          </Box>
          <Box component="li">
            <strong>Nắm vận động</strong>: Trong khoảng nghỉ, bạn có thể thực
            hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần hoàn
            máu.
          </Box>
          <Box component="li">
            <strong>Nắm vận động</strong>: Trong khoảng nghỉ, bạn có thể thực
            hiện một số động tác nhẹ để giảm căng thẳng cơ bắp và tăng tuần hoàn
            máu.
          </Box>
          <Box component="li">
            <strong>Tận dụng thời gian nghỉ</strong>: Sử dụng thời gian nghỉ để
            làm những công việc nhẹ nhàng hoặc thư giãn. Ví dụ, bạn có thể lập
            lịch gọi điện thoại, kiểm tra email, hoặc đọc một chút.
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default PomodoroInfo;
