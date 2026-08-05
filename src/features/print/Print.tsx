import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getPointResolution } from 'ol/proj.js';
import { useContext, useEffect, useRef } from 'react';
import MapContext from '../../context/MapContext';

const exportOptions: {
    useCORS: boolean;
    ignoreElements: (element: Element) => boolean;
    width?: number;
    height?: number;
} = {
    useCORS: true,
    ignoreElements: function (element: Element) {
        const className = element.className || '';
        return (
            className.includes('ol-control') &&
            !className.includes('ol-scale') &&
            (!className.includes('ol-attribution') || !className.includes('ol-uncollapsible'))
        );
    },
};

export const Print = () => {
    const ctx = useContext(MapContext);
    const exportButtonRef = useRef<HTMLButtonElement | null>(null);
    const formatRef = useRef<HTMLSelectElement | null>(null);
    const resolutionRef = useRef<HTMLSelectElement | null>(null);
    const scaleRef = useRef<HTMLSelectElement | null>(null);

    const dims = {
        a0: [1189, 841],
        a1: [841, 594],
        a2: [594, 420],
        a3: [420, 297],
        a4: [297, 210],
        a5: [210, 148],
    } as const;

    useEffect(() => {
        const exportButton = exportButtonRef.current;
        if (!exportButton || !ctx?.map) return;

        const handleClick = () => {
            exportButton.disabled = true;
            document.body.style.cursor = 'progress';

            if (!ctx || ctx.activeTool !== 'measure' || !ctx.MeasureType || !ctx.map) return;

            const format = formatRef.current?.value as keyof typeof dims;
            const resolution = resolutionRef.current?.value;
            const scale = scaleRef.current?.value;

            if (!format || !resolution || !scale) return;

            const dim = dims[format];
            const width = Math.round((dim[0] * Number(resolution)) / 25.4);
            const height = Math.round((dim[1] * Number(resolution)) / 25.4);
            const viewResolution = ctx.map.getView().getResolution();
            const scaleResolution =
                Number(scale) /
                getPointResolution(
                    ctx.map.getView().getProjection()!,
                    Number(resolution) / 25.4,
                    ctx.map.getView().getCenter()!,
                );

            ctx.map.once('rendercomplete', function () {
                exportOptions.width = width;
                exportOptions.height = height;

                html2canvas(ctx.map!.getViewport(), exportOptions).then(function (canvas) {
                    const pdf = new jsPDF('landscape', undefined, format);
                    pdf.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, 0, dim[0], dim[1]);
                    pdf.save('map.pdf');

                    ctx.scaleLineRef.current?.setDpi(undefined);
                    ctx.map!.getTargetElement().style.width = '';
                    ctx.map!.getTargetElement().style.height = '';
                    ctx.map!.updateSize();
                    ctx.map!.getView().setResolution(viewResolution);
                    exportButton.disabled = false;
                    document.body.style.cursor = 'auto';
                });
            });

            ctx.scaleLineRef.current?.setDpi(Number(resolution));
            ctx.map.getTargetElement().style.width = width + 'px';
            ctx.map.getTargetElement().style.height = height + 'px';
            ctx.map.updateSize();
            ctx.map.getView().setResolution(scaleResolution);
        };

        exportButton.addEventListener('click', handleClick);

        return () => {
            exportButton.removeEventListener('click', handleClick);
        };
    }, [ctx]);

    return (
        <div className="print-container">
            <div className="wrapper">
                <div id="map" className="map"></div>
            </div>
            <form className="form">
                <label htmlFor="format">Page size </label>
                <select id="format" ref={formatRef} defaultValue="a4">
                    <option value="a0">A0 (slow)</option>
                    <option value="a1">A1</option>
                    <option value="a2">A2</option>
                    <option value="a3">A3</option>
                    <option value="a4">A4</option>
                    <option value="a5">A5 (fast)</option>
                </select>

                <label htmlFor="resolution">Resolution </label>
                <select id="resolution" ref={resolutionRef} defaultValue="200">
                    <option value="72">72 dpi (fast)</option>
                    <option value="150">150 dpi</option>
                    <option value="200">200 dpi</option>
                    <option value="300">300 dpi (slow)</option>
                </select>

                <label htmlFor="scale">Scale </label>
                <select id="scale" ref={scaleRef} defaultValue="250">
                    <option value="500">1:500000</option>
                    <option value="250">1:250000</option>
                    <option value="100">1:100000</option>
                    <option value="50">1:50000</option>
                    <option value="25">1:25000</option>
                    <option value="10">1:10000</option>
                </select>
            </form>
            <button id="export-pdf" ref={exportButtonRef}>
                Export PDF
            </button>
        </div>
    );
};