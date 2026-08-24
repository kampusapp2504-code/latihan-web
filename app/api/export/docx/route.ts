import { HeadingLevel, Packer, Paragraph, Document } from "docx";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { revenue, orders, units, customers, products } = await request.json();
  const documentFile = new Document({ sections: [{ children: [new Paragraph({ text: "NusaCommerce Sales Report", heading: HeadingLevel.TITLE }), new Paragraph(`Revenue: ${revenue}`), new Paragraph(`Orders: ${orders} | Units sold: ${units} | Customers: ${customers}`), new Paragraph("Top products"), ...products.map((item: { product: string; revenue: string }) => new Paragraph(`${item.product}: ${item.revenue}`))] }] });
  const output = await Packer.toBuffer(documentFile);
  return new NextResponse(output as BodyInit, { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Content-Disposition": "attachment; filename=\"nusa-commerce-report.docx\"" } });
}
