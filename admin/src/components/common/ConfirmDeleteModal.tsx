import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

type ConfirmDeleteModalProps = {
  open: boolean;
  itemLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// Every delete action in this app goes through this — never an instant delete on a
// single click. See ui-rules.md's Admin App section.
export function ConfirmDeleteModal({ open, itemLabel, loading, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Delete {itemLabel}?</DialogTitle>
        <DialogContent>This can't be undone.</DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" loading={loading} onClick={onConfirm}>
            Delete
          </Button>
          <Button variant="plain" color="neutral" disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}
