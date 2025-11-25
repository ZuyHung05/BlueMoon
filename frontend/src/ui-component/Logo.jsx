// material-ui
import { useTheme } from '@mui/material/styles';

// project imports
// Thay 'logo.png' bằng tên file thực tế của bạn (ví dụ: 'logo-bluemoon.png')
import logo from 'assets/images/logo.png'; 

// ==============================|| LOGO IMAGE ||============================== //

export default function Logo() {
  const theme = useTheme();

  return (
    <img 
      src={logo} 
      alt="BlueMoon Logo" 
      width="150" // Bạn có thể chỉnh số này to/nhỏ tùy ý
      style={{ objectFit: 'contain' }} // Giúp ảnh không bị méo
    />
  );
}