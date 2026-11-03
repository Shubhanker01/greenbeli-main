// components/JournalDeleteModal.jsx : confirm deleting a journal article
import { useState } from "react";
import { LuLoader, LuTrash2 } from "react-icons/lu";
import FormModal, { errorMessage } from "./FormModal";

const Content = ({ item, onClose, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const confirm = async () => {
        if (deleting) return;
        setDeleting(true);
        setError("");
        try {
            await onDelete(item._id);
            onClose();
        } catch (err) {
            setError(errorMessage(err));
            setDeleting(false);
        }
    };

    return (
        <FormModal open title="Delete journal?" onClose={onClose} busy={deleting}>
            <div className="space-y-4 pt-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                    <LuTrash2 className="text-xl" />
                </div>
                <p className="text-sm text-slate-600">
                    <span className="font-bold text-slate-800">{item.title}</span> will be permanently deleted.
                    This can't be undone.
                </p>

                {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} disabled={deleting}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="button" onClick={confirm} disabled={deleting}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-70">
                        {deleting && <LuLoader className="animate-spin" />}
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </FormModal>
    );
};

const JournalDeleteModal = ({ item, ...props }) => (item ? <Content key={item._id} item={item} {...props} /> : null);
export default JournalDeleteModal;