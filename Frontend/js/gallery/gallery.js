import { gallery_layout } from "../../utils.js";
import { API } from "../config/api.js";
import { getFiles, deleteFile } from "../api/fileApi.js";
import { handleUnauthorized } from "../auth/auth.js";
import {
    isSelectionMode,
    selectedIds
} from "../selection/selection.js";


export async function showFiles() {

    let res;

    try {
        res = await getFiles();

    } catch (err) {

        handleUnauthorized(err);

        console.error(err);

        return;
    }


    const gallery = document.getElementById("files");

    const desiredImages =
        gallery.clientWidth < 600 ? 5 : 10;

    const targetHeight =
        gallery.clientWidth / desiredImages;


    const layout = gallery_layout(
        res.data,
        gallery.clientWidth,
        targetHeight
    );


    const ul = document.getElementById("files");

    ul.innerHTML = "";


    for (const row of layout) {

        const rowDiv =
            document.createElement("div");

        rowDiv.className = "gallery-row";


        for (const file of row) {

            const li =
                document.createElement("li");

            li.classList.add(
                "photo-item",
                "photo-card"
            );

            li.dataset.id = file._id;


            /*
             * CHECKBOX
             */

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            // IMPORTANT:
            // Your old CSS uses #check
            checkbox.id = "check";

            checkbox.dataset.id = file._id;

            checkbox.style.display =
                isSelectionMode()
                    ? "block"
                    : "none";


            checkbox.addEventListener(
                "click",
                (e) => {

                    e.stopPropagation();

                    if (checkbox.checked) {

                        selectedIds.add(
                            checkbox.dataset.id
                        );

                    } else {

                        selectedIds.delete(
                            checkbox.dataset.id
                        );
                    }

                    li.classList.toggle(
                        "selected",
                        checkbox.checked
                    );
                }
            );


            /*
             * FILE CARD CLICK
             */

            li.addEventListener(
                "click",
                (e) => {

                    if (
                        e.target.tagName === "BUTTON"
                    ) {
                        return;
                    }


                    checkbox.checked =
                        !checkbox.checked;


                    if (checkbox.checked) {

                        selectedIds.add(
                            checkbox.dataset.id
                        );

                    } else {

                        selectedIds.delete(
                            checkbox.dataset.id
                        );
                    }


                    li.classList.toggle(
                        "selected",
                        checkbox.checked
                    );
                }
            );


            /*
             * DELETE BUTTON
             */

            const delete_btn =
                document.createElement("button");

            delete_btn.type = "button";

            delete_btn.id = "delete";

            delete_btn.dataset.id =
                file._id;

            delete_btn.innerText =
                "Delete";


            /*
             * INDIVIDUAL DELETE
             *
             * This is intentionally kept
             * the same as your original code.
             */

            delete_btn.addEventListener(
                "click",
                async (e) => {

                    e.stopPropagation();

                    const id =
                        e.currentTarget.dataset.id;

                    try {

                        await deleteFile(id);

                        li.remove();

                        selectedIds.delete(id);

                    } catch (err) {

                        handleUnauthorized(err);

                        console.error(
                            "Delete failed:",
                            err
                        );
                    }
                }
            );


            /*
             * IMAGE
             */

            if (
                file.MimeType.startsWith("image/")
            ) {

                const img =
                    document.createElement("img");

                img.src =
                    `${API}/${file.path}`;

                img.style.width =
                    file.finalWidth + "px";

                img.style.height =
                    file.finalHeight + "px";


                const a =
                    document.createElement("a");

                a.href =
                    `${API}/${file.path}`;

                a.target = "_blank";


                a.appendChild(img);


                /*
                 * IMAGE DROPDOWN
                 */

                const dropdown =
                    document.createElement("div");


                dropdown.innerHTML = `
                    <div class="dropdown">

                        <button
                            class="menu-btn"
                            data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>

                        <ul class="dropdown-menu">

                            <li>
                                <button
                                    class="dropdown-item download-btn">
                                    Download
                                </button>
                            </li>

                            <li>
                                <button
                                    class="dropdown-item delete_btn text-danger">
                                    Delete
                                </button>
                            </li>

                        </ul>

                    </div>
                `;


                const dropdownDeleteBtn =
                    dropdown.querySelector(
                        ".delete_btn"
                    );


                /*
                 * IMAGE DROPDOWN DELETE
                 */

                dropdownDeleteBtn.addEventListener(
                    "click",
                    async (e) => {

                        e.stopPropagation();

                        try {

                            await deleteFile(
                                file._id
                            );

                            li.remove();

                            selectedIds.delete(
                                file._id
                            );

                        } catch (err) {

                            handleUnauthorized(err);

                            console.error(
                                "Delete failed:",
                                err
                            );
                        }
                    }
                );


                li.appendChild(a);

                li.appendChild(
                    dropdown.firstElementChild
                );

                li.appendChild(checkbox);

                rowDiv.appendChild(li);
            }


            /*
             * PDF
             */

            else if (
                file.MimeType ===
                "application/pdf"
            ) {

                const iframe =
                    document.createElement("iframe");

                iframe.src =
                    `${API}/${file.path}#toolbar=0`;


                const link =
                    document.createElement("a");

                link.href =
                    `${API}/${file.path}`;

                link.innerText =
                    "Open PDF";

                link.target =
                    "_blank";


                li.appendChild(iframe);

                li.appendChild(link);

                li.appendChild(delete_btn);

                li.appendChild(checkbox);

                rowDiv.appendChild(li);
            }


            /*
             * VIDEO
             */

            else if (
                file.MimeType.startsWith("video/")
            ) {

                const video =
                    document.createElement("video");

                video.src =
                    `${API}/${file.path}`;

                video.controls = true;

                video.preload = "metadata";

                video.style.width =
                    file.finalWidth + "px";

                video.style.height =
                    file.finalHeight + "px";


                const a =
                    document.createElement("a");

                a.href =
                    `${API}/${file.path}`;

                a.target =
                    "_blank";

                a.appendChild(video);


                li.appendChild(a);

                li.appendChild(delete_btn);

                li.appendChild(checkbox);

                rowDiv.appendChild(li);
            }
        }


        ul.appendChild(rowDiv);
    }
}