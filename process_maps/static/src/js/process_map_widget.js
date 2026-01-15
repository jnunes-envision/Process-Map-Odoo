/** @odoo-module **/

import { Component, onMounted, onWillUnmount, useRef, useState } from "@odoo/owl";
import { registry } from "@web/core/registry";

export class ProcessMapDiagramWidget extends Component {
    setup() {
        this.diagramContainer = useRef("diagramContainer");
        this.wrapperRef = useRef("wrapper");
        this.state = useState({
            zoom: 1,
            panX: 0,
            panY: 0,
            isDragging: false,
            startX: 0,
            startY: 0,
            isFullscreen: false
        });
        
        onMounted(() => {
            this.renderDiagram();
            this.setupInteractivity();
        });
        
        onWillUnmount(() => {
            this.cleanup();
        });
    }

    renderDiagram() {
        if (!this.diagramContainer.el) return;
        
        const container = this.diagramContainer.el;
        const record = this.props.record;
        const diagramType = record?.data?.diagram_type?.[0] || record?.data?.diagram_type || "mermaid";
        const diagramData = this.props.value || "";
        
        container.innerHTML = "";

        if (diagramType === "mermaid" && diagramData) {
            this.loadMermaid(container, diagramData);
        } else if (diagramType === "image") {
            this.loadImage(container, record);
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

    loadImage(container, record) {
        const img = document.createElement("img");
        const recordData = record?.data || {};
        const imageData = recordData.image?.[0] || recordData.image;
        if (imageData) {
            img.src = `data:image/png;base64,${imageData}`;
            img.className = "process-map-image";
            img.style.maxWidth = "100%";
            img.style.cursor = "grab";
            img.draggable = false;
            container.appendChild(img);
        }
    }

    loadMermaid(container, diagramData) {
        const loadMermaidLib = () => {
            if (typeof mermaid !== "undefined") {
                this.renderMermaidDiagram(container, diagramData);
            } else {
                const script = document.createElement("script");
                script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
                script.onload = () => {
                    mermaid.initialize({ 
                        startOnLoad: false, 
                        theme: "default",
                        securityLevel: "loose",
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true,
                            curve: "basis"
                        }
                    });
                    this.renderMermaidDiagram(container, diagramData);
                };
                script.onerror = () => {
                    container.innerHTML = '<div class="alert alert-warning">Could not load Mermaid library. Please check your internet connection.</div>';
                };
                document.head.appendChild(script);
            }
        };
        
        loadMermaidLib();
    }

    renderMermaidDiagram(container, diagramData) {
        try {
            const id = `mermaid-${Date.now()}`;
            const div = document.createElement("div");
            div.id = id;
            div.className = "mermaid interactive-diagram";
            div.textContent = diagramData;
            container.appendChild(div);
            
            mermaid.run({ nodes: [div] }).then(() => {
                this.makeNodesInteractive(container);
            });
        } catch (error) {
            container.innerHTML = `<div class="alert alert-danger">Error rendering Mermaid diagram: ${error.message}</div>`;
        }
    }

    makeNodesInteractive(container) {
        const svg = container.querySelector("svg");
        if (!svg) return;

        svg.style.cursor = "grab";
        svg.setAttribute("class", svg.getAttribute("class") + " interactive-svg");

        const nodes = svg.querySelectorAll(".node, .nodeLabel, .flowchart-node");
        nodes.forEach(node => {
            node.style.cursor = "pointer";
            node.style.transition = "all 0.2s ease";
            
            node.addEventListener("mouseenter", (e) => {
                e.target.style.opacity = "0.8";
                e.target.style.transform = "scale(1.05)";
            });
            
            node.addEventListener("mouseleave", (e) => {
                e.target.style.opacity = "1";
                e.target.style.transform = "scale(1)";
            });
            
            node.addEventListener("click", (e) => {
                const text = e.target.textContent || e.target.querySelector("text")?.textContent;
                if (text) {
                    console.log("Clicked node:", text);
                }
            });
        });
    }

    setupInteractivity() {
        if (!this.wrapperRef.el) return;
        
        const wrapper = this.wrapperRef.el;
        const container = this.diagramContainer.el;
        
        if (!container) return;

        let isDragging = false;
        let startX, startY, scrollLeft, scrollTop;

        wrapper.addEventListener("mousedown", (e) => {
            if (e.target.closest(".diagram-controls")) return;
            isDragging = true;
            startX = e.pageX - wrapper.offsetLeft;
            startY = e.pageY - wrapper.offsetTop;
            scrollLeft = wrapper.scrollLeft;
            scrollTop = wrapper.scrollTop;
            wrapper.style.cursor = "grabbing";
        });

        wrapper.addEventListener("mouseleave", () => {
            isDragging = false;
            wrapper.style.cursor = "grab";
        });

        wrapper.addEventListener("mouseup", () => {
            isDragging = false;
            wrapper.style.cursor = "grab";
        });

        wrapper.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const y = e.pageY - wrapper.offsetTop;
            const walkX = (x - startX) * 2;
            const walkY = (y - startY) * 2;
            wrapper.scrollLeft = scrollLeft - walkX;
            wrapper.scrollTop = scrollTop - walkY;
        });

        wrapper.addEventListener("wheel", (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 0.9 : 1.1;
                this.zoomDiagram(delta, e.offsetX, e.offsetY);
            }
        });
    }

    zoomDiagram(factor, centerX, centerY) {
        const svg = this.diagramContainer.el?.querySelector("svg");
        if (!svg) return;

        const currentZoom = parseFloat(svg.style.transform.match(/scale\(([^)]+)\)/)?.1 || "1");
        const newZoom = Math.max(0.5, Math.min(3, currentZoom * factor));
        
        svg.style.transformOrigin = `${centerX}px ${centerY}px`;
        svg.style.transform = `scale(${newZoom})`;
        svg.style.transition = "transform 0.1s ease-out";
    }

    zoomIn() {
        const svg = this.diagramContainer.el?.querySelector("svg");
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        this.zoomDiagram(1.2, rect.width / 2, rect.height / 2);
    }

    zoomOut() {
        const svg = this.diagramContainer.el?.querySelector("svg");
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        this.zoomDiagram(0.8, rect.width / 2, rect.height / 2);
    }

    resetZoom() {
        const svg = this.diagramContainer.el?.querySelector("svg");
        if (!svg) return;
        svg.style.transform = "scale(1)";
        svg.style.transformOrigin = "center center";
    }

    toggleFullscreen() {
        const widget = this.wrapperRef.el?.closest(".process-map-diagram-widget");
        if (!widget) return;

        if (!document.fullscreenElement) {
            widget.requestFullscreen().then(() => {
                this.state.isFullscreen = true;
            });
        } else {
            document.exitFullscreen().then(() => {
                this.state.isFullscreen = false;
            });
        }
    }

    cleanup() {
        if (this.state.isFullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

ProcessMapDiagramWidget.template = "process_maps.ProcessMapDiagramWidget";
ProcessMapDiagramWidget.props = {
    value: { type: String, optional: true },
    record: { type: Object, optional: true },
};

// Register the widget
registry.category("fields").add("process_map_diagram", ProcessMapDiagramWidget);
