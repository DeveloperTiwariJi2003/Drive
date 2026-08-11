import { deleteManyFiles } from "../api/fileApi.js";
import { selectedIds, clearSelection } from "../selection/selection.js";

export async function DeleteSelected() {
    const ids = [...selectedIds];

    if (!ids.length) return;

    ids.forEach(id => {
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) li.remove();
    });

    await deleteManyFiles(ids);

    clearSelection();
}
