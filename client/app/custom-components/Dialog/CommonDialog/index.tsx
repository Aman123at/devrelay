import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DIALOG_POSITIONS } from "@/interfaces/enums";
import { ICommonDialogProps } from "@/interfaces/propsInterfaces";
import { cn } from "@/lib/utils";
import React from "react";

const CommonDialog = ({
  open,
  onClose,
  header,
  body,
  position = DIALOG_POSITIONS.CENTER,
  footer,
}: ICommonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={
          position === DIALOG_POSITIONS.TOP
            ? cn(
                "sm:max-w-[600px] p-0",
                // Override default center positioning with top positioning
                "fixed top-[5%] left-[50%] translate-x-[-50%] translate-y-0",
                // Adjust animation to slide from top
                "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-[5%]",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-[5%]",
                "[&>button]:hidden"
              )
            : "sm:max-w-[600px] [&>button]:hidden"
        }
      >
        <DialogTitle>
          <DialogHeader>{header}</DialogHeader>
        </DialogTitle>
        {body}
        <DialogFooter>{footer ? footer : null}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
