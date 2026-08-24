import { NextResponse } from "next/server";
import pptxgen from "pptxgenjs";

export async function POST(request: Request) {
  const { revenue, orders, units, products } = await request.json();
  const presentation = new pptxgen();
  const slide = presentation.addSlide();
  slide.background = { color: "F5F6F2" };
  slide.addText("NusaCommerce", { x: 0.6, y: 0.5, fontSize: 28, bold: true, color: "202925" });
  slide.addText("Sales intelligence report", { x: 0.6, y: 1.1, fontSize: 16, color: "7F8983" });
  slide.addText(`Revenue\n${revenue}`, { x: 0.6, y: 2, w: 2.3, h: 1, fontSize: 20, bold: true, color: "E36B3D" });
  slide.addText(`Orders\n${orders}`, { x: 3.2, y: 2, w: 1.7, h: 1, fontSize: 20, bold: true, color: "3F7D68" });
  slide.addText(`Units sold\n${units}`, { x: 5.2, y: 2, w: 1.7, h: 1, fontSize: 20, bold: true, color: "BF8E25" });
  slide.addText("Top products", { x: 0.6, y: 3.7, fontSize: 15, bold: true, color: "202925" });
  slide.addText(products.map((item: { product: string; revenue: string }) => `${item.product}: ${item.revenue}`).join("\n"), { x: 0.6, y: 4.1, fontSize: 13, color: "4D5A52" });
  const output = await presentation.write({ outputType: "nodebuffer" });
  return new NextResponse(output as BodyInit, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation", "Content-Disposition": "attachment; filename=\"nusa-commerce-report.pptx\"" } });
}
