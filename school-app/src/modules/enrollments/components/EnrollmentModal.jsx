import { Modal, Box } from '@mui/material';
import FormEnrollment from './FormEnrollment';

// Modal con el mismo estilo que el de estudiantes y profesores
export default function EnrollmentModal({ open, onClose, enrollment, fixedStudent, onSubmit, onSuccess }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '92%', sm: '90%', md: 720 },
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '1rem',
          outline: 'none',
          backgroundColor: 'rgba(15, 61, 46, 0.85)',
        }}
      >
        <FormEnrollment
          key={enrollment?.id || 'create'} // 🔑 fuerza re-mount al cambiar
          enrollment={enrollment}
          fixedStudent={fixedStudent}
          onSubmit={onSubmit}
          onSuccess={onSuccess}
        />
      </Box>
    </Modal>
  );
}
