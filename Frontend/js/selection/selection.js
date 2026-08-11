let selectionMode = false;

export const selectedIds = new Set();

export function toggleSelectionMode() {
    selectionMode = !selectionMode;

    document.getElementById("selectBtn").innerText =
        selectionMode ? "Cancel" : "Select Files";

    document.getElementById("DeleteSelectedBtn").style.display =
        selectionMode ? "inline-block" : "none";

    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.style.display = selectionMode ? "block" : "none";
    });
}

export function isSelectionMode() {
    return selectionMode;
}

export function toggleSelected(id) {
    if (selectedIds.has(id)) {
        selectedIds.delete(id);
        return false;
    }

    selectedIds.add(id);
    return true;
}

export function clearSelection() {
    selectedIds.clear();
}
