/** @odoo-module **/

import { Component, onMounted, useRef } from "@odoo/owl";

export class ProcessMapDiagramWidget extends Component {
    setup() {
        this.diagramContainer = useRef("diagramContainer");
        onMounted(() => {
            this.renderDiagram();
        });
    }

    renderDiagram() {
        if (!this.diagramContainer.el) return;
        
        const container = this.diagramContainer.el;
        const diagramType = this.props.record?.data?.diagram_type || "mermaid";
        const diagramData = this.props.value || "";
        
        container.innerHTML = "";

        if (diagramType === "mermaid" && diagramData) {
            this.loadMermaid(container, diagramData);
        } else if (diagramType === "image") {
            const img = document.createElement("img");
            const imageData = this.props.record?.data?.image;
            if (imageData) {
                img.src = `data:image/png;base64,${imageData}`;
            }
            img.className = "img-fluid";
            img.style.maxWidth = "100%";
            container.appendChild(img);
        } else if (diagramData) {
            const pre = document.createElement("pre");
            pre.className = "bg-light p-3 border rounded";
            pre.style.whiteSpace = "pre-wrap";
            pre.textContent = diagramData;
            container.appendChild(pre);
        } else {
            container.innerHTML = '<div class="alert alert-info">No diagram data available. Add diagram data or upload an image.</div>';
        }
    }

    loadMermaid(container, diagramData) {
        if (typeof mermaid !== "undefined") {
            try {
                const id = `mermaid-${Date.now()}`;
                const div = document.createElement("div");
                div.id = id;
                div.className = "mermaid";
                div.textContent = diagramData;
                container.appendChild(div);
                mermaid.run({ nodes: [div] });
            } catch (error) {
                container.innerHTML = `<div class="alert alert-danger">Error rendering Mermaid diagram: ${error.message}</div>`;
            }
        } else {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
            script.onload = () => {
                mermaid.initialize({ startOnLoad: false, theme: "default" });
                const id = `mermaid-${Date.now()}`;
                const div = document.createElement("div");
                div.id = id;
                div.className = "mermaid";
                div.textContent = diagramData;
                container.innerHTML = "";
                container.appendChild(div);
                mermaid.run({ nodes: [div] });
            };
            script.onerror = () => {
                container.innerHTML = '<div class="alert alert-warning">Could not load Mermaid library. Please check your internet connection.</div>';
            };
            document.head.appendChild(script);
        }
    }
}

ProcessMapDiagramWidget.template = "process_maps.ProcessMapDiagramWidget";
ProcessMapDiagramWidget.props = {
    value: { type: String, optional: true },
    record: { type: Object, optional: true },
};
