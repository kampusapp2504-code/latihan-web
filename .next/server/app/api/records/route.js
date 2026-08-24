/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/records/route";
exports.ids = ["app/api/records/route"];
exports.modules = {

/***/ "(rsc)/./app/api/records/route.ts":
/*!**********************************!*\
  !*** ./app/api/records/route.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var googleapis__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! googleapis */ \"(rsc)/./node_modules/googleapis/build/src/index.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst spreadsheetId = process.env.GOOGLE_SHEET_ID || \"1svp7av4wpn6HzgrC7FpdXnjFWCKtiHq2rItxWcE4FbE\";\nconst sheetName = process.env.GOOGLE_SHEET_NAME || \"Sheet1\";\nconst columns = [\n    \"order_id\",\n    \"date\",\n    \"product\",\n    \"category\",\n    \"price\",\n    \"quantity\",\n    \"city\",\n    \"customer\"\n];\nasync function callAppsScript(action, body) {\n    const url = process.env.GOOGLE_APPS_SCRIPT_URL;\n    if (!url) return null;\n    const response = await fetch(url, {\n        method: \"POST\",\n        headers: {\n            \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify({\n            action,\n            ...body\n        }),\n        cache: \"no-store\"\n    });\n    if (response.url.includes(\"accounts.google.com\") || response.status === 401 || response.status === 403) {\n        throw new Error(\"Apps Script meminta login. Deploy ulang sebagai Web app dengan 'Who has access: Anyone'.\");\n    }\n    const contentType = response.headers.get(\"content-type\") || \"\";\n    if (!contentType.includes(\"application/json\")) throw new Error(\"Apps Script tidak mengembalikan JSON. Pastikan URL deployment berakhiran /exec dan aksesnya Anyone.\");\n    const result = await response.json();\n    if (!response.ok || result.error) throw new Error(result.error || `Apps Script merespons status ${response.status}.`);\n    return result;\n}\nfunction getSheets() {\n    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;\n    const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\\\n/g, \"\\n\");\n    if (!email || !key) throw new Error(\"Google Service Account belum dikonfigurasi.\");\n    const auth = new googleapis__WEBPACK_IMPORTED_MODULE_1__.google.auth.GoogleAuth({\n        credentials: {\n            client_email: email,\n            private_key: key\n        },\n        scopes: [\n            \"https://www.googleapis.com/auth/spreadsheets\"\n        ]\n    });\n    return googleapis__WEBPACK_IMPORTED_MODULE_1__.google.sheets({\n        version: \"v4\",\n        auth\n    });\n}\nfunction valuesFromBody(body) {\n    return columns.map((column)=>body[column] ?? \"\");\n}\nasync function findRow(sheets, orderId) {\n    const result = await sheets.spreadsheets.values.get({\n        spreadsheetId,\n        range: `${sheetName}!A:H`\n    });\n    const values = result.data.values ?? [];\n    const rowIndex = values.findIndex((row)=>row[0] === orderId);\n    return {\n        values,\n        rowIndex\n    };\n}\nfunction errorResponse(error) {\n    const message = error instanceof Error ? error.message : \"Operasi Google Sheets gagal.\";\n    const status = message.includes(\"belum dikonfigurasi\") ? 503 : message.includes(\"meminta login\") || message.includes(\"Who has access\") ? 401 : 500;\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        error: message\n    }, {\n        status\n    });\n}\nasync function POST(request) {\n    try {\n        const body = await request.json();\n        if (!body.order_id || !body.product || !body.date) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Order ID, tanggal, dan produk wajib diisi.\"\n        }, {\n            status: 400\n        });\n        const appsScriptResult = await callAppsScript(\"create\", body);\n        if (appsScriptResult) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            provider: \"apps-script\"\n        });\n        const sheets = getSheets();\n        const existing = await findRow(sheets, body.order_id);\n        if (existing.rowIndex > 0) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Order ID sudah digunakan.\"\n        }, {\n            status: 409\n        });\n        await sheets.spreadsheets.values.append({\n            spreadsheetId,\n            range: `${sheetName}!A:H`,\n            valueInputOption: \"USER_ENTERED\",\n            requestBody: {\n                values: [\n                    valuesFromBody(body)\n                ]\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true\n        });\n    } catch (error) {\n        return errorResponse(error);\n    }\n}\nasync function PUT(request) {\n    try {\n        const body = await request.json();\n        const currentOrderId = typeof body.current_order_id === \"string\" ? body.current_order_id : body.order_id;\n        const appsScriptResult = await callAppsScript(\"update\", body);\n        if (appsScriptResult) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            provider: \"apps-script\"\n        });\n        const sheets = getSheets();\n        const existing = await findRow(sheets, currentOrderId);\n        if (existing.rowIndex < 1) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Order tidak ditemukan.\"\n        }, {\n            status: 404\n        });\n        await sheets.spreadsheets.values.update({\n            spreadsheetId,\n            range: `${sheetName}!A${existing.rowIndex + 1}:H${existing.rowIndex + 1}`,\n            valueInputOption: \"USER_ENTERED\",\n            requestBody: {\n                values: [\n                    valuesFromBody(body)\n                ]\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true\n        });\n    } catch (error) {\n        return errorResponse(error);\n    }\n}\nasync function DELETE(request) {\n    try {\n        const { order_id: orderId } = await request.json();\n        const appsScriptResult = await callAppsScript(\"delete\", {\n            order_id: orderId\n        });\n        if (appsScriptResult) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true,\n            provider: \"apps-script\"\n        });\n        const sheets = getSheets();\n        const existing = await findRow(sheets, orderId);\n        if (existing.rowIndex < 1) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Order tidak ditemukan.\"\n        }, {\n            status: 404\n        });\n        const metadata = await sheets.spreadsheets.get({\n            spreadsheetId,\n            fields: \"sheets(properties(sheetId,title))\"\n        });\n        const sheet = metadata.data.sheets?.find((item)=>item.properties?.title === sheetName);\n        if (sheet?.properties?.sheetId === undefined) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: `Sheet '${sheetName}' tidak ditemukan.`\n        }, {\n            status: 404\n        });\n        await sheets.spreadsheets.batchUpdate({\n            spreadsheetId,\n            requestBody: {\n                requests: [\n                    {\n                        deleteDimension: {\n                            range: {\n                                sheetId: sheet.properties.sheetId,\n                                dimension: \"ROWS\",\n                                startIndex: existing.rowIndex,\n                                endIndex: existing.rowIndex + 1\n                            }\n                        }\n                    }\n                ]\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            ok: true\n        });\n    } catch (error) {\n        return errorResponse(error);\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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bGFqYXItaXQvUGh5dG9uL2JlbGFqYXItZGF0YS1zY2llbmNlLW1haW4vY291cnNlL2FwcC9hcGkvcmVjb3Jkcy9yb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnb29nbGUgfSBmcm9tIFwiZ29vZ2xlYXBpc1wiO1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSBcIm5leHQvc2VydmVyXCI7XG5cbmNvbnN0IHNwcmVhZHNoZWV0SWQgPSBwcm9jZXNzLmVudi5HT09HTEVfU0hFRVRfSUQgfHwgXCIxc3ZwN2F2NHdwbjZIemdyQzdGcGRYbmpGV0NLdGlIcTJySXR4V2NFNEZiRVwiO1xuY29uc3Qgc2hlZXROYW1lID0gcHJvY2Vzcy5lbnYuR09PR0xFX1NIRUVUX05BTUUgfHwgXCJTaGVldDFcIjtcbmNvbnN0IGNvbHVtbnMgPSBbXCJvcmRlcl9pZFwiLCBcImRhdGVcIiwgXCJwcm9kdWN0XCIsIFwiY2F0ZWdvcnlcIiwgXCJwcmljZVwiLCBcInF1YW50aXR5XCIsIFwiY2l0eVwiLCBcImN1c3RvbWVyXCJdO1xuXG50eXBlIFJlY29yZEJvZHkgPSBSZWNvcmQ8KHR5cGVvZiBjb2x1bW5zKVtudW1iZXJdLCBzdHJpbmc+O1xuXG5hc3luYyBmdW5jdGlvbiBjYWxsQXBwc1NjcmlwdChhY3Rpb246IFwiY3JlYXRlXCIgfCBcInVwZGF0ZVwiIHwgXCJkZWxldGVcIiwgYm9keTogUmVjb3JkQm9keSB8IHsgb3JkZXJfaWQ6IHN0cmluZyB9KSB7XG4gIGNvbnN0IHVybCA9IHByb2Nlc3MuZW52LkdPT0dMRV9BUFBTX1NDUklQVF9VUkw7XG4gIGlmICghdXJsKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiBcIlBPU1RcIiwgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFjdGlvbiwgLi4uYm9keSB9KSwgY2FjaGU6IFwibm8tc3RvcmVcIiB9KTtcbiAgaWYgKHJlc3BvbnNlLnVybC5pbmNsdWRlcyhcImFjY291bnRzLmdvb2dsZS5jb21cIikgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSA0MDEgfHwgcmVzcG9uc2Uuc3RhdHVzID09PSA0MDMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJBcHBzIFNjcmlwdCBtZW1pbnRhIGxvZ2luLiBEZXBsb3kgdWxhbmcgc2ViYWdhaSBXZWIgYXBwIGRlbmdhbiAnV2hvIGhhcyBhY2Nlc3M6IEFueW9uZScuXCIpO1xuICB9XG4gIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIikgfHwgXCJcIjtcbiAgaWYgKCFjb250ZW50VHlwZS5pbmNsdWRlcyhcImFwcGxpY2F0aW9uL2pzb25cIikpIHRocm93IG5ldyBFcnJvcihcIkFwcHMgU2NyaXB0IHRpZGFrIG1lbmdlbWJhbGlrYW4gSlNPTi4gUGFzdGlrYW4gVVJMIGRlcGxveW1lbnQgYmVyYWtoaXJhbiAvZXhlYyBkYW4gYWtzZXNueWEgQW55b25lLlwiKTtcbiAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICBpZiAoIXJlc3BvbnNlLm9rIHx8IHJlc3VsdC5lcnJvcikgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvciB8fCBgQXBwcyBTY3JpcHQgbWVyZXNwb25zIHN0YXR1cyAke3Jlc3BvbnNlLnN0YXR1c30uYCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGdldFNoZWV0cygpIHtcbiAgY29uc3QgZW1haWwgPSBwcm9jZXNzLmVudi5HT09HTEVfU0VSVklDRV9BQ0NPVU5UX0VNQUlMO1xuICBjb25zdCBrZXkgPSBwcm9jZXNzLmVudi5HT09HTEVfU0VSVklDRV9BQ0NPVU5UX1BSSVZBVEVfS0VZPy5yZXBsYWNlKC9cXFxcbi9nLCBcIlxcblwiKTtcbiAgaWYgKCFlbWFpbCB8fCAha2V5KSB0aHJvdyBuZXcgRXJyb3IoXCJHb29nbGUgU2VydmljZSBBY2NvdW50IGJlbHVtIGRpa29uZmlndXJhc2kuXCIpO1xuICBjb25zdCBhdXRoID0gbmV3IGdvb2dsZS5hdXRoLkdvb2dsZUF1dGgoeyBjcmVkZW50aWFsczogeyBjbGllbnRfZW1haWw6IGVtYWlsLCBwcml2YXRlX2tleToga2V5IH0sIHNjb3BlczogW1wiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC9zcHJlYWRzaGVldHNcIl0gfSk7XG4gIHJldHVybiBnb29nbGUuc2hlZXRzKHsgdmVyc2lvbjogXCJ2NFwiLCBhdXRoIH0pO1xufVxuXG5mdW5jdGlvbiB2YWx1ZXNGcm9tQm9keShib2R5OiBSZWNvcmRCb2R5KSB7XG4gIHJldHVybiBjb2x1bW5zLm1hcCgoY29sdW1uKSA9PiBib2R5W2NvbHVtbl0gPz8gXCJcIik7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGZpbmRSb3coc2hlZXRzOiBSZXR1cm5UeXBlPHR5cGVvZiBnb29nbGUuc2hlZXRzPiwgb3JkZXJJZDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHNoZWV0cy5zcHJlYWRzaGVldHMudmFsdWVzLmdldCh7IHNwcmVhZHNoZWV0SWQsIHJhbmdlOiBgJHtzaGVldE5hbWV9IUE6SGAgfSk7XG4gIGNvbnN0IHZhbHVlcyA9IHJlc3VsdC5kYXRhLnZhbHVlcyA/PyBbXTtcbiAgY29uc3Qgcm93SW5kZXggPSB2YWx1ZXMuZmluZEluZGV4KChyb3cpID0+IHJvd1swXSA9PT0gb3JkZXJJZCk7XG4gIHJldHVybiB7IHZhbHVlcywgcm93SW5kZXggfTtcbn1cblxuZnVuY3Rpb24gZXJyb3JSZXNwb25zZShlcnJvcjogdW5rbm93bikge1xuICBjb25zdCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBcIk9wZXJhc2kgR29vZ2xlIFNoZWV0cyBnYWdhbC5cIjtcbiAgY29uc3Qgc3RhdHVzID0gbWVzc2FnZS5pbmNsdWRlcyhcImJlbHVtIGRpa29uZmlndXJhc2lcIikgPyA1MDMgOiBtZXNzYWdlLmluY2x1ZGVzKFwibWVtaW50YSBsb2dpblwiKSB8fCBtZXNzYWdlLmluY2x1ZGVzKFwiV2hvIGhhcyBhY2Nlc3NcIikgPyA0MDEgOiA1MDA7XG4gIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBtZXNzYWdlIH0sIHsgc3RhdHVzIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpIGFzIFJlY29yZEJvZHk7XG4gICAgaWYgKCFib2R5Lm9yZGVyX2lkIHx8ICFib2R5LnByb2R1Y3QgfHwgIWJvZHkuZGF0ZSkgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiT3JkZXIgSUQsIHRhbmdnYWwsIGRhbiBwcm9kdWsgd2FqaWIgZGlpc2kuXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICBjb25zdCBhcHBzU2NyaXB0UmVzdWx0ID0gYXdhaXQgY2FsbEFwcHNTY3JpcHQoXCJjcmVhdGVcIiwgYm9keSk7XG4gICAgaWYgKGFwcHNTY3JpcHRSZXN1bHQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlLCBwcm92aWRlcjogXCJhcHBzLXNjcmlwdFwiIH0pO1xuICAgIGNvbnN0IHNoZWV0cyA9IGdldFNoZWV0cygpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgZmluZFJvdyhzaGVldHMsIGJvZHkub3JkZXJfaWQpO1xuICAgIGlmIChleGlzdGluZy5yb3dJbmRleCA+IDApIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIk9yZGVyIElEIHN1ZGFoIGRpZ3VuYWthbi5cIiB9LCB7IHN0YXR1czogNDA5IH0pO1xuICAgIGF3YWl0IHNoZWV0cy5zcHJlYWRzaGVldHMudmFsdWVzLmFwcGVuZCh7IHNwcmVhZHNoZWV0SWQsIHJhbmdlOiBgJHtzaGVldE5hbWV9IUE6SGAsIHZhbHVlSW5wdXRPcHRpb246IFwiVVNFUl9FTlRFUkVEXCIsIHJlcXVlc3RCb2R5OiB7IHZhbHVlczogW3ZhbHVlc0Zyb21Cb2R5KGJvZHkpXSB9IH0pO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlIH0pO1xuICB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gZXJyb3JSZXNwb25zZShlcnJvcik7IH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBVVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpIGFzIFJlY29yZEJvZHk7XG4gICAgY29uc3QgY3VycmVudE9yZGVySWQgPSB0eXBlb2YgYm9keS5jdXJyZW50X29yZGVyX2lkID09PSBcInN0cmluZ1wiID8gYm9keS5jdXJyZW50X29yZGVyX2lkIDogYm9keS5vcmRlcl9pZDtcbiAgICBjb25zdCBhcHBzU2NyaXB0UmVzdWx0ID0gYXdhaXQgY2FsbEFwcHNTY3JpcHQoXCJ1cGRhdGVcIiwgYm9keSk7XG4gICAgaWYgKGFwcHNTY3JpcHRSZXN1bHQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlLCBwcm92aWRlcjogXCJhcHBzLXNjcmlwdFwiIH0pO1xuICAgIGNvbnN0IHNoZWV0cyA9IGdldFNoZWV0cygpO1xuICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgZmluZFJvdyhzaGVldHMsIGN1cnJlbnRPcmRlcklkKTtcbiAgICBpZiAoZXhpc3Rpbmcucm93SW5kZXggPCAxKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJPcmRlciB0aWRhayBkaXRlbXVrYW4uXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcbiAgICBhd2FpdCBzaGVldHMuc3ByZWFkc2hlZXRzLnZhbHVlcy51cGRhdGUoeyBzcHJlYWRzaGVldElkLCByYW5nZTogYCR7c2hlZXROYW1lfSFBJHtleGlzdGluZy5yb3dJbmRleCArIDF9Okgke2V4aXN0aW5nLnJvd0luZGV4ICsgMX1gLCB2YWx1ZUlucHV0T3B0aW9uOiBcIlVTRVJfRU5URVJFRFwiLCByZXF1ZXN0Qm9keTogeyB2YWx1ZXM6IFt2YWx1ZXNGcm9tQm9keShib2R5KV0gfSB9KTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgcmV0dXJuIGVycm9yUmVzcG9uc2UoZXJyb3IpOyB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBERUxFVEUocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgb3JkZXJfaWQ6IG9yZGVySWQgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpIGFzIHsgb3JkZXJfaWQ6IHN0cmluZyB9O1xuICAgIGNvbnN0IGFwcHNTY3JpcHRSZXN1bHQgPSBhd2FpdCBjYWxsQXBwc1NjcmlwdChcImRlbGV0ZVwiLCB7IG9yZGVyX2lkOiBvcmRlcklkIH0pO1xuICAgIGlmIChhcHBzU2NyaXB0UmVzdWx0KSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBvazogdHJ1ZSwgcHJvdmlkZXI6IFwiYXBwcy1zY3JpcHRcIiB9KTtcbiAgICBjb25zdCBzaGVldHMgPSBnZXRTaGVldHMoKTtcbiAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IGZpbmRSb3coc2hlZXRzLCBvcmRlcklkKTtcbiAgICBpZiAoZXhpc3Rpbmcucm93SW5kZXggPCAxKSByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJPcmRlciB0aWRhayBkaXRlbXVrYW4uXCIgfSwgeyBzdGF0dXM6IDQwNCB9KTtcbiAgICBjb25zdCBtZXRhZGF0YSA9IGF3YWl0IHNoZWV0cy5zcHJlYWRzaGVldHMuZ2V0KHsgc3ByZWFkc2hlZXRJZCwgZmllbGRzOiBcInNoZWV0cyhwcm9wZXJ0aWVzKHNoZWV0SWQsdGl0bGUpKVwiIH0pO1xuICAgIGNvbnN0IHNoZWV0ID0gbWV0YWRhdGEuZGF0YS5zaGVldHM/LmZpbmQoKGl0ZW0pID0+IGl0ZW0ucHJvcGVydGllcz8udGl0bGUgPT09IHNoZWV0TmFtZSk7XG4gICAgaWYgKHNoZWV0Py5wcm9wZXJ0aWVzPy5zaGVldElkID09PSB1bmRlZmluZWQpIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBgU2hlZXQgJyR7c2hlZXROYW1lfScgdGlkYWsgZGl0ZW11a2FuLmAgfSwgeyBzdGF0dXM6IDQwNCB9KTtcbiAgICBhd2FpdCBzaGVldHMuc3ByZWFkc2hlZXRzLmJhdGNoVXBkYXRlKHsgc3ByZWFkc2hlZXRJZCwgcmVxdWVzdEJvZHk6IHsgcmVxdWVzdHM6IFt7IGRlbGV0ZURpbWVuc2lvbjogeyByYW5nZTogeyBzaGVldElkOiBzaGVldC5wcm9wZXJ0aWVzLnNoZWV0SWQsIGRpbWVuc2lvbjogXCJST1dTXCIsIHN0YXJ0SW5kZXg6IGV4aXN0aW5nLnJvd0luZGV4LCBlbmRJbmRleDogZXhpc3Rpbmcucm93SW5kZXggKyAxIH0gfSB9XSB9IH0pO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG9rOiB0cnVlIH0pO1xuICB9IGNhdGNoIChlcnJvcikgeyByZXR1cm4gZXJyb3JSZXNwb25zZShlcnJvcik7IH1cbn1cbiJdLCJuYW1lcyI6WyJnb29nbGUiLCJOZXh0UmVzcG9uc2UiLCJzcHJlYWRzaGVldElkIiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9TSEVFVF9JRCIsInNoZWV0TmFtZSIsIkdPT0dMRV9TSEVFVF9OQU1FIiwiY29sdW1ucyIsImNhbGxBcHBzU2NyaXB0IiwiYWN0aW9uIiwiYm9keSIsInVybCIsIkdPT0dMRV9BUFBTX1NDUklQVF9VUkwiLCJyZXNwb25zZSIsImZldGNoIiwibWV0aG9kIiwiaGVhZGVycyIsIkpTT04iLCJzdHJpbmdpZnkiLCJjYWNoZSIsImluY2x1ZGVzIiwic3RhdHVzIiwiRXJyb3IiLCJjb250ZW50VHlwZSIsImdldCIsInJlc3VsdCIsImpzb24iLCJvayIsImVycm9yIiwiZ2V0U2hlZXRzIiwiZW1haWwiLCJHT09HTEVfU0VSVklDRV9BQ0NPVU5UX0VNQUlMIiwia2V5IiwiR09PR0xFX1NFUlZJQ0VfQUNDT1VOVF9QUklWQVRFX0tFWSIsInJlcGxhY2UiLCJhdXRoIiwiR29vZ2xlQXV0aCIsImNyZWRlbnRpYWxzIiwiY2xpZW50X2VtYWlsIiwicHJpdmF0ZV9rZXkiLCJzY29wZXMiLCJzaGVldHMiLCJ2ZXJzaW9uIiwidmFsdWVzRnJvbUJvZHkiLCJtYXAiLCJjb2x1bW4iLCJmaW5kUm93Iiwib3JkZXJJZCIsInNwcmVhZHNoZWV0cyIsInZhbHVlcyIsInJhbmdlIiwiZGF0YSIsInJvd0luZGV4IiwiZmluZEluZGV4Iiwicm93IiwiZXJyb3JSZXNwb25zZSIsIm1lc3NhZ2UiLCJQT1NUIiwicmVxdWVzdCIsIm9yZGVyX2lkIiwicHJvZHVjdCIsImRhdGUiLCJhcHBzU2NyaXB0UmVzdWx0IiwicHJvdmlkZXIiLCJleGlzdGluZyIsImFwcGVuZCIsInZhbHVlSW5wdXRPcHRpb24iLCJyZXF1ZXN0Qm9keSIsIlBVVCIsImN1cnJlbnRPcmRlcklkIiwiY3VycmVudF9vcmRlcl9pZCIsInVwZGF0ZSIsIkRFTEVURSIsIm1ldGFkYXRhIiwiZmllbGRzIiwic2hlZXQiLCJmaW5kIiwiaXRlbSIsInByb3BlcnRpZXMiLCJ0aXRsZSIsInNoZWV0SWQiLCJ1bmRlZmluZWQiLCJiYXRjaFVwZGF0ZSIsInJlcXVlc3RzIiwiZGVsZXRlRGltZW5zaW9uIiwiZGltZW5zaW9uIiwic3RhcnRJbmRleCIsImVuZEluZGV4Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/records/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Frecords%2Froute&page=%2Fapi%2Frecords%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Frecords%2Froute.ts&appDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Frecords%2Froute&page=%2Fapi%2Frecords%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Frecords%2Froute.ts&appDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=! ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handler: () => (/* binding */ handler),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/dist/server/request-meta */ \"(rsc)/./node_modules/next/dist/server/request-meta.js\");\n/* harmony import */ var next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/dist/server/lib/trace/tracer */ \"(rsc)/./node_modules/next/dist/server/lib/trace/tracer.js\");\n/* harmony import */ var next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/dist/shared/lib/router/utils/app-paths */ \"next/dist/shared/lib/router/utils/app-paths\");\n/* harmony import */ var next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/dist/server/base-http/node */ \"(rsc)/./node_modules/next/dist/server/base-http/node.js\");\n/* harmony import */ var next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! next/dist/server/web/spec-extension/adapters/next-request */ \"(rsc)/./node_modules/next/dist/server/web/spec-extension/adapters/next-request.js\");\n/* harmony import */ var next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/dist/server/lib/trace/constants */ \"(rsc)/./node_modules/next/dist/server/lib/trace/constants.js\");\n/* harmony import */ var next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! next/dist/server/instrumentation/utils */ \"(rsc)/./node_modules/next/dist/server/instrumentation/utils.js\");\n/* harmony import */ var next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! next/dist/server/send-response */ \"(rsc)/./node_modules/next/dist/server/send-response.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! next/dist/server/web/utils */ \"(rsc)/./node_modules/next/dist/server/web/utils.js\");\n/* harmony import */ var next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! next/dist/server/lib/cache-control */ \"(rsc)/./node_modules/next/dist/server/lib/cache-control.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! next/dist/lib/constants */ \"(rsc)/./node_modules/next/dist/lib/constants.js\");\n/* harmony import */ var next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! next/dist/shared/lib/no-fallback-error.external */ \"next/dist/shared/lib/no-fallback-error.external\");\n/* harmony import */ var next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! next/dist/server/response-cache */ \"(rsc)/./node_modules/next/dist/server/response-cache/index.js\");\n/* harmony import */ var next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var _Users_afifs_Documents_Belajar_it_Phyton_belajar_data_science_main_course_app_api_records_route_ts__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./app/api/records/route.ts */ \"(rsc)/./app/api/records/route.ts\");\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/records/route\",\n        pathname: \"/api/records\",\n        filename: \"route\",\n        bundlePath: \"app/api/records/route\"\n    },\n    distDir: \".next\" || 0,\n    relativeProjectDir:  false || '',\n    resolvedPagePath: \"/Users/afifs/Documents/Belajar-it/Phyton/belajar-data-science-main/course/app/api/records/route.ts\",\n    nextConfigOutput,\n    userland: _Users_afifs_Documents_Belajar_it_Phyton_belajar_data_science_main_course_app_api_records_route_ts__WEBPACK_IMPORTED_MODULE_16__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\nasync function handler(req, res, ctx) {\n    var _nextConfig_experimental;\n    let srcPage = \"/api/records/route\";\n    // turbopack doesn't normalize `/index` in the page name\n    // so we need to to process dynamic routes properly\n    // TODO: fix turbopack providing differing value from webpack\n    if (false) {} else if (srcPage === '/index') {\n        // we always normalize /index specifically\n        srcPage = '/';\n    }\n    const multiZoneDraftMode = false;\n    const prepareResult = await routeModule.prepare(req, res, {\n        srcPage,\n        multiZoneDraftMode\n    });\n    if (!prepareResult) {\n        res.statusCode = 400;\n        res.end('Bad Request');\n        ctx.waitUntil == null ? void 0 : ctx.waitUntil.call(ctx, Promise.resolve());\n        return null;\n    }\n    const { buildId, params, nextConfig, isDraftMode, prerenderManifest, routerServerContext, isOnDemandRevalidate, revalidateOnlyGenerated, resolvedPathname } = prepareResult;\n    const normalizedSrcPage = (0,next_dist_shared_lib_router_utils_app_paths__WEBPACK_IMPORTED_MODULE_5__.normalizeAppPath)(srcPage);\n    let isIsr = Boolean(prerenderManifest.dynamicRoutes[normalizedSrcPage] || prerenderManifest.routes[resolvedPathname]);\n    if (isIsr && !isDraftMode) {\n        const isPrerendered = Boolean(prerenderManifest.routes[resolvedPathname]);\n        const prerenderInfo = prerenderManifest.dynamicRoutes[normalizedSrcPage];\n        if (prerenderInfo) {\n            if (prerenderInfo.fallback === false && !isPrerendered) {\n                throw new next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError();\n            }\n        }\n    }\n    let cacheKey = null;\n    if (isIsr && !routeModule.isDev && !isDraftMode) {\n        cacheKey = resolvedPathname;\n        // ensure /index and / is normalized to one key\n        cacheKey = cacheKey === '/index' ? '/' : cacheKey;\n    }\n    const supportsDynamicResponse = // If we're in development, we always support dynamic HTML\n    routeModule.isDev === true || // If this is not SSG or does not have static paths, then it supports\n    // dynamic HTML.\n    !isIsr;\n    // This is a revalidation request if the request is for a static\n    // page and it is not being resumed from a postponed render and\n    // it is not a dynamic RSC request then it is a revalidation\n    // request.\n    const isRevalidate = isIsr && !supportsDynamicResponse;\n    const method = req.method || 'GET';\n    const tracer = (0,next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.getTracer)();\n    const activeSpan = tracer.getActiveScopeSpan();\n    const context = {\n        params,\n        prerenderManifest,\n        renderOpts: {\n            experimental: {\n                cacheComponents: Boolean(nextConfig.experimental.cacheComponents),\n                authInterrupts: Boolean(nextConfig.experimental.authInterrupts)\n            },\n            supportsDynamicResponse,\n            incrementalCache: (0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'incrementalCache'),\n            cacheLifeProfiles: (_nextConfig_experimental = nextConfig.experimental) == null ? void 0 : _nextConfig_experimental.cacheLife,\n            isRevalidate,\n            waitUntil: ctx.waitUntil,\n            onClose: (cb)=>{\n                res.on('close', cb);\n            },\n            onAfterTaskError: undefined,\n            onInstrumentationRequestError: (error, _request, errorContext)=>routeModule.onRequestError(req, error, errorContext, routerServerContext)\n        },\n        sharedContext: {\n            buildId\n        }\n    };\n    const nodeNextReq = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextRequest(req);\n    const nodeNextRes = new next_dist_server_base_http_node__WEBPACK_IMPORTED_MODULE_6__.NodeNextResponse(res);\n    const nextReq = next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.NextRequestAdapter.fromNodeNextRequest(nodeNextReq, (0,next_dist_server_web_spec_extension_adapters_next_request__WEBPACK_IMPORTED_MODULE_7__.signalFromNodeResponse)(res));\n    try {\n        const invokeRouteModule = async (span)=>{\n            return routeModule.handle(nextReq, context).finally(()=>{\n                if (!span) return;\n                span.setAttributes({\n                    'http.status_code': res.statusCode,\n                    'next.rsc': false\n                });\n                const rootSpanAttributes = tracer.getRootSpanAttributes();\n                // We were unable to get attributes, probably OTEL is not enabled\n                if (!rootSpanAttributes) {\n                    return;\n                }\n                if (rootSpanAttributes.get('next.span_type') !== next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest) {\n                    console.warn(`Unexpected root span type '${rootSpanAttributes.get('next.span_type')}'. Please report this Next.js issue https://github.com/vercel/next.js`);\n                    return;\n                }\n                const route = rootSpanAttributes.get('next.route');\n                if (route) {\n                    const name = `${method} ${route}`;\n                    span.setAttributes({\n                        'next.route': route,\n                        'http.route': route,\n                        'next.span_name': name\n                    });\n                    span.updateName(name);\n                } else {\n                    span.updateName(`${method} ${req.url}`);\n                }\n            });\n        };\n        const handleResponse = async (currentSpan)=>{\n            var _cacheEntry_value;\n            const responseGenerator = async ({ previousCacheEntry })=>{\n                try {\n                    if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isOnDemandRevalidate && revalidateOnlyGenerated && !previousCacheEntry) {\n                        res.statusCode = 404;\n                        // on-demand revalidate always sets this header\n                        res.setHeader('x-nextjs-cache', 'REVALIDATED');\n                        res.end('This page could not be found');\n                        return null;\n                    }\n                    const response = await invokeRouteModule(currentSpan);\n                    req.fetchMetrics = context.renderOpts.fetchMetrics;\n                    let pendingWaitUntil = context.renderOpts.pendingWaitUntil;\n                    // Attempt using provided waitUntil if available\n                    // if it's not we fallback to sendResponse's handling\n                    if (pendingWaitUntil) {\n                        if (ctx.waitUntil) {\n                            ctx.waitUntil(pendingWaitUntil);\n                            pendingWaitUntil = undefined;\n                        }\n                    }\n                    const cacheTags = context.renderOpts.collectedTags;\n                    // If the request is for a static response, we can cache it so long\n                    // as it's not edge.\n                    if (isIsr) {\n                        const blob = await response.blob();\n                        // Copy the headers from the response.\n                        const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.toNodeOutgoingHttpHeaders)(response.headers);\n                        if (cacheTags) {\n                            headers[next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER] = cacheTags;\n                        }\n                        if (!headers['content-type'] && blob.type) {\n                            headers['content-type'] = blob.type;\n                        }\n                        const revalidate = typeof context.renderOpts.collectedRevalidate === 'undefined' || context.renderOpts.collectedRevalidate >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? false : context.renderOpts.collectedRevalidate;\n                        const expire = typeof context.renderOpts.collectedExpire === 'undefined' || context.renderOpts.collectedExpire >= next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.INFINITE_CACHE ? undefined : context.renderOpts.collectedExpire;\n                        // Create the cache entry for the response.\n                        const cacheEntry = {\n                            value: {\n                                kind: next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE,\n                                status: response.status,\n                                body: Buffer.from(await blob.arrayBuffer()),\n                                headers\n                            },\n                            cacheControl: {\n                                revalidate,\n                                expire\n                            }\n                        };\n                        return cacheEntry;\n                    } else {\n                        // send response without caching if not ISR\n                        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, response, context.renderOpts.pendingWaitUntil);\n                        return null;\n                    }\n                } catch (err) {\n                    // if this is a background revalidate we need to report\n                    // the request error here as it won't be bubbled\n                    if (previousCacheEntry == null ? void 0 : previousCacheEntry.isStale) {\n                        await routeModule.onRequestError(req, err, {\n                            routerKind: 'App Router',\n                            routePath: srcPage,\n                            routeType: 'route',\n                            revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                                isRevalidate,\n                                isOnDemandRevalidate\n                            })\n                        }, routerServerContext);\n                    }\n                    throw err;\n                }\n            };\n            const cacheEntry = await routeModule.handleResponse({\n                req,\n                nextConfig,\n                cacheKey,\n                routeKind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n                isFallback: false,\n                prerenderManifest,\n                isRoutePPREnabled: false,\n                isOnDemandRevalidate,\n                revalidateOnlyGenerated,\n                responseGenerator,\n                waitUntil: ctx.waitUntil\n            });\n            // we don't create a cacheEntry for ISR\n            if (!isIsr) {\n                return null;\n            }\n            if ((cacheEntry == null ? void 0 : (_cacheEntry_value = cacheEntry.value) == null ? void 0 : _cacheEntry_value.kind) !== next_dist_server_response_cache__WEBPACK_IMPORTED_MODULE_15__.CachedRouteKind.APP_ROUTE) {\n                var _cacheEntry_value1;\n                throw Object.defineProperty(new Error(`Invariant: app-route received invalid cache entry ${cacheEntry == null ? void 0 : (_cacheEntry_value1 = cacheEntry.value) == null ? void 0 : _cacheEntry_value1.kind}`), \"__NEXT_ERROR_CODE\", {\n                    value: \"E701\",\n                    enumerable: false,\n                    configurable: true\n                });\n            }\n            if (!(0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode')) {\n                res.setHeader('x-nextjs-cache', isOnDemandRevalidate ? 'REVALIDATED' : cacheEntry.isMiss ? 'MISS' : cacheEntry.isStale ? 'STALE' : 'HIT');\n            }\n            // Draft mode should never be cached\n            if (isDraftMode) {\n                res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0, must-revalidate');\n            }\n            const headers = (0,next_dist_server_web_utils__WEBPACK_IMPORTED_MODULE_11__.fromNodeOutgoingHttpHeaders)(cacheEntry.value.headers);\n            if (!((0,next_dist_server_request_meta__WEBPACK_IMPORTED_MODULE_3__.getRequestMeta)(req, 'minimalMode') && isIsr)) {\n                headers.delete(next_dist_lib_constants__WEBPACK_IMPORTED_MODULE_13__.NEXT_CACHE_TAGS_HEADER);\n            }\n            // If cache control is already set on the response we don't\n            // override it to allow users to customize it via next.config\n            if (cacheEntry.cacheControl && !res.getHeader('Cache-Control') && !headers.get('Cache-Control')) {\n                headers.set('Cache-Control', (0,next_dist_server_lib_cache_control__WEBPACK_IMPORTED_MODULE_12__.getCacheControlHeader)(cacheEntry.cacheControl));\n            }\n            await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(cacheEntry.value.body, {\n                headers,\n                status: cacheEntry.value.status || 200\n            }));\n            return null;\n        };\n        // TODO: activeSpan code path is for when wrapped by\n        // next-server can be removed when this is no longer used\n        if (activeSpan) {\n            await handleResponse(activeSpan);\n        } else {\n            await tracer.withPropagatedContext(req.headers, ()=>tracer.trace(next_dist_server_lib_trace_constants__WEBPACK_IMPORTED_MODULE_8__.BaseServerSpan.handleRequest, {\n                    spanName: `${method} ${req.url}`,\n                    kind: next_dist_server_lib_trace_tracer__WEBPACK_IMPORTED_MODULE_4__.SpanKind.SERVER,\n                    attributes: {\n                        'http.method': method,\n                        'http.target': req.url\n                    }\n                }, handleResponse));\n        }\n    } catch (err) {\n        if (!(err instanceof next_dist_shared_lib_no_fallback_error_external__WEBPACK_IMPORTED_MODULE_14__.NoFallbackError)) {\n            await routeModule.onRequestError(req, err, {\n                routerKind: 'App Router',\n                routePath: normalizedSrcPage,\n                routeType: 'route',\n                revalidateReason: (0,next_dist_server_instrumentation_utils__WEBPACK_IMPORTED_MODULE_9__.getRevalidateReason)({\n                    isRevalidate,\n                    isOnDemandRevalidate\n                })\n            });\n        }\n        // rethrow so that we can handle serving error page\n        // If this is during static generation, throw the error again.\n        if (isIsr) throw err;\n        // Otherwise, send a 500 response.\n        await (0,next_dist_server_send_response__WEBPACK_IMPORTED_MODULE_10__.sendResponse)(nodeNextReq, nodeNextRes, new Response(null, {\n            status: 500\n        }));\n        return null;\n    }\n}\n\n//# sourceMappingURL=app-route.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZyZWNvcmRzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZyZWNvcmRzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcmVjb3JkcyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFmaWZzJTJGRG9jdW1lbnRzJTJGQmVsYWphci1pdCUyRlBoeXRvbiUyRmJlbGFqYXItZGF0YS1zY2llbmNlLW1haW4lMkZjb3Vyc2UlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYWZpZnMlMkZEb2N1bWVudHMlMkZCZWxhamFyLWl0JTJGUGh5dG9uJTJGYmVsYWphci1kYXRhLXNjaWVuY2UtbWFpbiUyRmNvdXJzZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCZpc0dsb2JhbE5vdEZvdW5kRW5hYmxlZD0hIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ2Q7QUFDUztBQUNPO0FBQ0s7QUFDbUM7QUFDakQ7QUFDTztBQUNmO0FBQ3NDO0FBQ3pCO0FBQ007QUFDQztBQUNoQjtBQUM2RDtBQUMvSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxhQUFhLE9BQW9DLElBQUks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Q3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLDBGQUFxQjtBQUNsRTtBQUNBLGtCQUFrQiw2RUFBWTtBQUM5QjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDViw2RUFBNkUsZ0ZBQWM7QUFDM0YsaUNBQWlDLFFBQVEsRUFBRSxRQUFRO0FBQ25ELDBCQUEwQix1RUFBUTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLE1BQU07QUFDTiw2QkFBNkIsNkZBQWU7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsMkZBQW1CO0FBQ3JEO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLDZFQUFZO0FBQzFCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCB7IGdldFJlcXVlc3RNZXRhIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcmVxdWVzdC1tZXRhXCI7XG5pbXBvcnQgeyBnZXRUcmFjZXIsIFNwYW5LaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3RyYWNlL3RyYWNlclwiO1xuaW1wb3J0IHsgbm9ybWFsaXplQXBwUGF0aCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2hhcmVkL2xpYi9yb3V0ZXIvdXRpbHMvYXBwLXBhdGhzXCI7XG5pbXBvcnQgeyBOb2RlTmV4dFJlcXVlc3QsIE5vZGVOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9iYXNlLWh0dHAvbm9kZVwiO1xuaW1wb3J0IHsgTmV4dFJlcXVlc3RBZGFwdGVyLCBzaWduYWxGcm9tTm9kZVJlc3BvbnNlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvd2ViL3NwZWMtZXh0ZW5zaW9uL2FkYXB0ZXJzL25leHQtcmVxdWVzdFwiO1xuaW1wb3J0IHsgQmFzZVNlcnZlclNwYW4gfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvdHJhY2UvY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBnZXRSZXZhbGlkYXRlUmVhc29uIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvaW5zdHJ1bWVudGF0aW9uL3V0aWxzXCI7XG5pbXBvcnQgeyBzZW5kUmVzcG9uc2UgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9zZW5kLXJlc3BvbnNlXCI7XG5pbXBvcnQgeyBmcm9tTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMsIHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci93ZWIvdXRpbHNcIjtcbmltcG9ydCB7IGdldENhY2hlQ29udHJvbEhlYWRlciB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9jYWNoZS1jb250cm9sXCI7XG5pbXBvcnQgeyBJTkZJTklURV9DQUNIRSwgTkVYVF9DQUNIRV9UQUdTX0hFQURFUiB9IGZyb20gXCJuZXh0L2Rpc3QvbGliL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgTm9GYWxsYmFja0Vycm9yIH0gZnJvbSBcIm5leHQvZGlzdC9zaGFyZWQvbGliL25vLWZhbGxiYWNrLWVycm9yLmV4dGVybmFsXCI7XG5pbXBvcnQgeyBDYWNoZWRSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yZXNwb25zZS1jYWNoZVwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9hZmlmcy9Eb2N1bWVudHMvQmVsYWphci1pdC9QaHl0b24vYmVsYWphci1kYXRhLXNjaWVuY2UtbWFpbi9jb3Vyc2UvYXBwL2FwaS9yZWNvcmRzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9yZWNvcmRzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmVjb3Jkc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcmVjb3Jkcy9yb3V0ZVwiXG4gICAgfSxcbiAgICBkaXN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfRElTVF9ESVIgfHwgJycsXG4gICAgcmVsYXRpdmVQcm9qZWN0RGlyOiBwcm9jZXNzLmVudi5fX05FWFRfUkVMQVRJVkVfUFJPSkVDVF9ESVIgfHwgJycsXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvYWZpZnMvRG9jdW1lbnRzL0JlbGFqYXItaXQvUGh5dG9uL2JlbGFqYXItZGF0YS1zY2llbmNlLW1haW4vY291cnNlL2FwcC9hcGkvcmVjb3Jkcy9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSwgcmVzLCBjdHgpIHtcbiAgICB2YXIgX25leHRDb25maWdfZXhwZXJpbWVudGFsO1xuICAgIGxldCBzcmNQYWdlID0gXCIvYXBpL3JlY29yZHMvcm91dGVcIjtcbiAgICAvLyB0dXJib3BhY2sgZG9lc24ndCBub3JtYWxpemUgYC9pbmRleGAgaW4gdGhlIHBhZ2UgbmFtZVxuICAgIC8vIHNvIHdlIG5lZWQgdG8gdG8gcHJvY2VzcyBkeW5hbWljIHJvdXRlcyBwcm9wZXJseVxuICAgIC8vIFRPRE86IGZpeCB0dXJib3BhY2sgcHJvdmlkaW5nIGRpZmZlcmluZyB2YWx1ZSBmcm9tIHdlYnBhY2tcbiAgICBpZiAocHJvY2Vzcy5lbnYuVFVSQk9QQUNLKSB7XG4gICAgICAgIHNyY1BhZ2UgPSBzcmNQYWdlLnJlcGxhY2UoL1xcL2luZGV4JC8sICcnKSB8fCAnLyc7XG4gICAgfSBlbHNlIGlmIChzcmNQYWdlID09PSAnL2luZGV4Jykge1xuICAgICAgICAvLyB3ZSBhbHdheXMgbm9ybWFsaXplIC9pbmRleCBzcGVjaWZpY2FsbHlcbiAgICAgICAgc3JjUGFnZSA9ICcvJztcbiAgICB9XG4gICAgY29uc3QgbXVsdGlab25lRHJhZnRNb2RlID0gcHJvY2Vzcy5lbnYuX19ORVhUX01VTFRJX1pPTkVfRFJBRlRfTU9ERTtcbiAgICBjb25zdCBwcmVwYXJlUmVzdWx0ID0gYXdhaXQgcm91dGVNb2R1bGUucHJlcGFyZShyZXEsIHJlcywge1xuICAgICAgICBzcmNQYWdlLFxuICAgICAgICBtdWx0aVpvbmVEcmFmdE1vZGVcbiAgICB9KTtcbiAgICBpZiAoIXByZXBhcmVSZXN1bHQpIHtcbiAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDA7XG4gICAgICAgIHJlcy5lbmQoJ0JhZCBSZXF1ZXN0Jyk7XG4gICAgICAgIGN0eC53YWl0VW50aWwgPT0gbnVsbCA/IHZvaWQgMCA6IGN0eC53YWl0VW50aWwuY2FsbChjdHgsIFByb21pc2UucmVzb2x2ZSgpKTtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IHsgYnVpbGRJZCwgcGFyYW1zLCBuZXh0Q29uZmlnLCBpc0RyYWZ0TW9kZSwgcHJlcmVuZGVyTWFuaWZlc3QsIHJvdXRlclNlcnZlckNvbnRleHQsIGlzT25EZW1hbmRSZXZhbGlkYXRlLCByZXZhbGlkYXRlT25seUdlbmVyYXRlZCwgcmVzb2x2ZWRQYXRobmFtZSB9ID0gcHJlcGFyZVJlc3VsdDtcbiAgICBjb25zdCBub3JtYWxpemVkU3JjUGFnZSA9IG5vcm1hbGl6ZUFwcFBhdGgoc3JjUGFnZSk7XG4gICAgbGV0IGlzSXNyID0gQm9vbGVhbihwcmVyZW5kZXJNYW5pZmVzdC5keW5hbWljUm91dGVzW25vcm1hbGl6ZWRTcmNQYWdlXSB8fCBwcmVyZW5kZXJNYW5pZmVzdC5yb3V0ZXNbcmVzb2x2ZWRQYXRobmFtZV0pO1xuICAgIGlmIChpc0lzciAmJiAhaXNEcmFmdE1vZGUpIHtcbiAgICAgICAgY29uc3QgaXNQcmVyZW5kZXJlZCA9IEJvb2xlYW4ocHJlcmVuZGVyTWFuaWZlc3Qucm91dGVzW3Jlc29sdmVkUGF0aG5hbWVdKTtcbiAgICAgICAgY29uc3QgcHJlcmVuZGVySW5mbyA9IHByZXJlbmRlck1hbmlmZXN0LmR5bmFtaWNSb3V0ZXNbbm9ybWFsaXplZFNyY1BhZ2VdO1xuICAgICAgICBpZiAocHJlcmVuZGVySW5mbykge1xuICAgICAgICAgICAgaWYgKHByZXJlbmRlckluZm8uZmFsbGJhY2sgPT09IGZhbHNlICYmICFpc1ByZXJlbmRlcmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE5vRmFsbGJhY2tFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCBjYWNoZUtleSA9IG51bGw7XG4gICAgaWYgKGlzSXNyICYmICFyb3V0ZU1vZHVsZS5pc0RldiAmJiAhaXNEcmFmdE1vZGUpIHtcbiAgICAgICAgY2FjaGVLZXkgPSByZXNvbHZlZFBhdGhuYW1lO1xuICAgICAgICAvLyBlbnN1cmUgL2luZGV4IGFuZCAvIGlzIG5vcm1hbGl6ZWQgdG8gb25lIGtleVxuICAgICAgICBjYWNoZUtleSA9IGNhY2hlS2V5ID09PSAnL2luZGV4JyA/ICcvJyA6IGNhY2hlS2V5O1xuICAgIH1cbiAgICBjb25zdCBzdXBwb3J0c0R5bmFtaWNSZXNwb25zZSA9IC8vIElmIHdlJ3JlIGluIGRldmVsb3BtZW50LCB3ZSBhbHdheXMgc3VwcG9ydCBkeW5hbWljIEhUTUxcbiAgICByb3V0ZU1vZHVsZS5pc0RldiA9PT0gdHJ1ZSB8fCAvLyBJZiB0aGlzIGlzIG5vdCBTU0cgb3IgZG9lcyBub3QgaGF2ZSBzdGF0aWMgcGF0aHMsIHRoZW4gaXQgc3VwcG9ydHNcbiAgICAvLyBkeW5hbWljIEhUTUwuXG4gICAgIWlzSXNyO1xuICAgIC8vIFRoaXMgaXMgYSByZXZhbGlkYXRpb24gcmVxdWVzdCBpZiB0aGUgcmVxdWVzdCBpcyBmb3IgYSBzdGF0aWNcbiAgICAvLyBwYWdlIGFuZCBpdCBpcyBub3QgYmVpbmcgcmVzdW1lZCBmcm9tIGEgcG9zdHBvbmVkIHJlbmRlciBhbmRcbiAgICAvLyBpdCBpcyBub3QgYSBkeW5hbWljIFJTQyByZXF1ZXN0IHRoZW4gaXQgaXMgYSByZXZhbGlkYXRpb25cbiAgICAvLyByZXF1ZXN0LlxuICAgIGNvbnN0IGlzUmV2YWxpZGF0ZSA9IGlzSXNyICYmICFzdXBwb3J0c0R5bmFtaWNSZXNwb25zZTtcbiAgICBjb25zdCBtZXRob2QgPSByZXEubWV0aG9kIHx8ICdHRVQnO1xuICAgIGNvbnN0IHRyYWNlciA9IGdldFRyYWNlcigpO1xuICAgIGNvbnN0IGFjdGl2ZVNwYW4gPSB0cmFjZXIuZ2V0QWN0aXZlU2NvcGVTcGFuKCk7XG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgICAgcGFyYW1zLFxuICAgICAgICBwcmVyZW5kZXJNYW5pZmVzdCxcbiAgICAgICAgcmVuZGVyT3B0czoge1xuICAgICAgICAgICAgZXhwZXJpbWVudGFsOiB7XG4gICAgICAgICAgICAgICAgY2FjaGVDb21wb25lbnRzOiBCb29sZWFuKG5leHRDb25maWcuZXhwZXJpbWVudGFsLmNhY2hlQ29tcG9uZW50cyksXG4gICAgICAgICAgICAgICAgYXV0aEludGVycnVwdHM6IEJvb2xlYW4obmV4dENvbmZpZy5leHBlcmltZW50YWwuYXV0aEludGVycnVwdHMpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VwcG9ydHNEeW5hbWljUmVzcG9uc2UsXG4gICAgICAgICAgICBpbmNyZW1lbnRhbENhY2hlOiBnZXRSZXF1ZXN0TWV0YShyZXEsICdpbmNyZW1lbnRhbENhY2hlJyksXG4gICAgICAgICAgICBjYWNoZUxpZmVQcm9maWxlczogKF9uZXh0Q29uZmlnX2V4cGVyaW1lbnRhbCA9IG5leHRDb25maWcuZXhwZXJpbWVudGFsKSA9PSBudWxsID8gdm9pZCAwIDogX25leHRDb25maWdfZXhwZXJpbWVudGFsLmNhY2hlTGlmZSxcbiAgICAgICAgICAgIGlzUmV2YWxpZGF0ZSxcbiAgICAgICAgICAgIHdhaXRVbnRpbDogY3R4LndhaXRVbnRpbCxcbiAgICAgICAgICAgIG9uQ2xvc2U6IChjYik9PntcbiAgICAgICAgICAgICAgICByZXMub24oJ2Nsb3NlJywgY2IpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQWZ0ZXJUYXNrRXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG9uSW5zdHJ1bWVudGF0aW9uUmVxdWVzdEVycm9yOiAoZXJyb3IsIF9yZXF1ZXN0LCBlcnJvckNvbnRleHQpPT5yb3V0ZU1vZHVsZS5vblJlcXVlc3RFcnJvcihyZXEsIGVycm9yLCBlcnJvckNvbnRleHQsIHJvdXRlclNlcnZlckNvbnRleHQpXG4gICAgICAgIH0sXG4gICAgICAgIHNoYXJlZENvbnRleHQ6IHtcbiAgICAgICAgICAgIGJ1aWxkSWRcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgbm9kZU5leHRSZXEgPSBuZXcgTm9kZU5leHRSZXF1ZXN0KHJlcSk7XG4gICAgY29uc3Qgbm9kZU5leHRSZXMgPSBuZXcgTm9kZU5leHRSZXNwb25zZShyZXMpO1xuICAgIGNvbnN0IG5leHRSZXEgPSBOZXh0UmVxdWVzdEFkYXB0ZXIuZnJvbU5vZGVOZXh0UmVxdWVzdChub2RlTmV4dFJlcSwgc2lnbmFsRnJvbU5vZGVSZXNwb25zZShyZXMpKTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBpbnZva2VSb3V0ZU1vZHVsZSA9IGFzeW5jIChzcGFuKT0+e1xuICAgICAgICAgICAgcmV0dXJuIHJvdXRlTW9kdWxlLmhhbmRsZShuZXh0UmVxLCBjb250ZXh0KS5maW5hbGx5KCgpPT57XG4gICAgICAgICAgICAgICAgaWYgKCFzcGFuKSByZXR1cm47XG4gICAgICAgICAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGVzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2h0dHAuc3RhdHVzX2NvZGUnOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgICAgICAgICAgICAgJ25leHQucnNjJzogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCByb290U3BhbkF0dHJpYnV0ZXMgPSB0cmFjZXIuZ2V0Um9vdFNwYW5BdHRyaWJ1dGVzKCk7XG4gICAgICAgICAgICAgICAgLy8gV2Ugd2VyZSB1bmFibGUgdG8gZ2V0IGF0dHJpYnV0ZXMsIHByb2JhYmx5IE9URUwgaXMgbm90IGVuYWJsZWRcbiAgICAgICAgICAgICAgICBpZiAoIXJvb3RTcGFuQXR0cmlidXRlcykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnNwYW5fdHlwZScpICE9PSBCYXNlU2VydmVyU3Bhbi5oYW5kbGVSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgVW5leHBlY3RlZCByb290IHNwYW4gdHlwZSAnJHtyb290U3BhbkF0dHJpYnV0ZXMuZ2V0KCduZXh0LnNwYW5fdHlwZScpfScuIFBsZWFzZSByZXBvcnQgdGhpcyBOZXh0LmpzIGlzc3VlIGh0dHBzOi8vZ2l0aHViLmNvbS92ZXJjZWwvbmV4dC5qc2ApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdXRlID0gcm9vdFNwYW5BdHRyaWJ1dGVzLmdldCgnbmV4dC5yb3V0ZScpO1xuICAgICAgICAgICAgICAgIGlmIChyb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gYCR7bWV0aG9kfSAke3JvdXRlfWA7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4uc2V0QXR0cmlidXRlcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnbmV4dC5yb3V0ZSc6IHJvdXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2h0dHAucm91dGUnOiByb3V0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICduZXh0LnNwYW5fbmFtZSc6IG5hbWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNwYW4udXBkYXRlTmFtZShuYW1lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzcGFuLnVwZGF0ZU5hbWUoYCR7bWV0aG9kfSAke3JlcS51cmx9YCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGhhbmRsZVJlc3BvbnNlID0gYXN5bmMgKGN1cnJlbnRTcGFuKT0+e1xuICAgICAgICAgICAgdmFyIF9jYWNoZUVudHJ5X3ZhbHVlO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2VHZW5lcmF0b3IgPSBhc3luYyAoeyBwcmV2aW91c0NhY2hlRW50cnkgfSk9PntcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWdldFJlcXVlc3RNZXRhKHJlcSwgJ21pbmltYWxNb2RlJykgJiYgaXNPbkRlbWFuZFJldmFsaWRhdGUgJiYgcmV2YWxpZGF0ZU9ubHlHZW5lcmF0ZWQgJiYgIXByZXZpb3VzQ2FjaGVFbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBvbi1kZW1hbmQgcmV2YWxpZGF0ZSBhbHdheXMgc2V0cyB0aGlzIGhlYWRlclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcigneC1uZXh0anMtY2FjaGUnLCAnUkVWQUxJREFURUQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5lbmQoJ1RoaXMgcGFnZSBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW52b2tlUm91dGVNb2R1bGUoY3VycmVudFNwYW4pO1xuICAgICAgICAgICAgICAgICAgICByZXEuZmV0Y2hNZXRyaWNzID0gY29udGV4dC5yZW5kZXJPcHRzLmZldGNoTWV0cmljcztcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBlbmRpbmdXYWl0VW50aWwgPSBjb250ZXh0LnJlbmRlck9wdHMucGVuZGluZ1dhaXRVbnRpbDtcbiAgICAgICAgICAgICAgICAgICAgLy8gQXR0ZW1wdCB1c2luZyBwcm92aWRlZCB3YWl0VW50aWwgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGl0J3Mgbm90IHdlIGZhbGxiYWNrIHRvIHNlbmRSZXNwb25zZSdzIGhhbmRsaW5nXG4gICAgICAgICAgICAgICAgICAgIGlmIChwZW5kaW5nV2FpdFVudGlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3R4LndhaXRVbnRpbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN0eC53YWl0VW50aWwocGVuZGluZ1dhaXRVbnRpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVuZGluZ1dhaXRVbnRpbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZVRhZ3MgPSBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkVGFncztcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgaXMgZm9yIGEgc3RhdGljIHJlc3BvbnNlLCB3ZSBjYW4gY2FjaGUgaXQgc28gbG9uZ1xuICAgICAgICAgICAgICAgICAgICAvLyBhcyBpdCdzIG5vdCBlZGdlLlxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNJc3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCByZXNwb25zZS5ibG9iKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSBoZWFkZXJzIGZyb20gdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IHRvTm9kZU91dGdvaW5nSHR0cEhlYWRlcnMocmVzcG9uc2UuaGVhZGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FjaGVUYWdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1tORVhUX0NBQ0hFX1RBR1NfSEVBREVSXSA9IGNhY2hlVGFncztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaGVhZGVyc1snY29udGVudC10eXBlJ10gJiYgYmxvYi50eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1snY29udGVudC10eXBlJ10gPSBibG9iLnR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXZhbGlkYXRlID0gdHlwZW9mIGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRSZXZhbGlkYXRlID09PSAndW5kZWZpbmVkJyB8fCBjb250ZXh0LnJlbmRlck9wdHMuY29sbGVjdGVkUmV2YWxpZGF0ZSA+PSBJTkZJTklURV9DQUNIRSA/IGZhbHNlIDogY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZFJldmFsaWRhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBpcmUgPSB0eXBlb2YgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZSA9PT0gJ3VuZGVmaW5lZCcgfHwgY29udGV4dC5yZW5kZXJPcHRzLmNvbGxlY3RlZEV4cGlyZSA+PSBJTkZJTklURV9DQUNIRSA/IHVuZGVmaW5lZCA6IGNvbnRleHQucmVuZGVyT3B0cy5jb2xsZWN0ZWRFeHBpcmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDcmVhdGUgdGhlIGNhY2hlIGVudHJ5IGZvciB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjYWNoZUVudHJ5ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQ6IENhY2hlZFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib2R5OiBCdWZmZXIuZnJvbShhd2FpdCBibG9iLmFycmF5QnVmZmVyKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXJzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZUNvbnRyb2w6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2YWxpZGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwaXJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZUVudHJ5O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VuZCByZXNwb25zZSB3aXRob3V0IGNhY2hpbmcgaWYgbm90IElTUlxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgc2VuZFJlc3BvbnNlKG5vZGVOZXh0UmVxLCBub2RlTmV4dFJlcywgcmVzcG9uc2UsIGNvbnRleHQucmVuZGVyT3B0cy5wZW5kaW5nV2FpdFVudGlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoaXMgaXMgYSBiYWNrZ3JvdW5kIHJldmFsaWRhdGUgd2UgbmVlZCB0byByZXBvcnRcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIHJlcXVlc3QgZXJyb3IgaGVyZSBhcyBpdCB3b24ndCBiZSBidWJibGVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2aW91c0NhY2hlRW50cnkgPT0gbnVsbCA/IHZvaWQgMCA6IHByZXZpb3VzQ2FjaGVFbnRyeS5pc1N0YWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCByb3V0ZU1vZHVsZS5vblJlcXVlc3RFcnJvcihyZXEsIGVyciwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlcktpbmQ6ICdBcHAgUm91dGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZVBhdGg6IHNyY1BhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVUeXBlOiAncm91dGUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmFsaWRhdGVSZWFzb246IGdldFJldmFsaWRhdGVSZWFzb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1JldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHJvdXRlclNlcnZlckNvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgY29uc3QgY2FjaGVFbnRyeSA9IGF3YWl0IHJvdXRlTW9kdWxlLmhhbmRsZVJlc3BvbnNlKHtcbiAgICAgICAgICAgICAgICByZXEsXG4gICAgICAgICAgICAgICAgbmV4dENvbmZpZyxcbiAgICAgICAgICAgICAgICBjYWNoZUtleSxcbiAgICAgICAgICAgICAgICByb3V0ZUtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgICAgICAgICAgaXNGYWxsYmFjazogZmFsc2UsXG4gICAgICAgICAgICAgICAgcHJlcmVuZGVyTWFuaWZlc3QsXG4gICAgICAgICAgICAgICAgaXNSb3V0ZVBQUkVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlLFxuICAgICAgICAgICAgICAgIHJldmFsaWRhdGVPbmx5R2VuZXJhdGVkLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlR2VuZXJhdG9yLFxuICAgICAgICAgICAgICAgIHdhaXRVbnRpbDogY3R4LndhaXRVbnRpbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyB3ZSBkb24ndCBjcmVhdGUgYSBjYWNoZUVudHJ5IGZvciBJU1JcbiAgICAgICAgICAgIGlmICghaXNJc3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgoY2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogKF9jYWNoZUVudHJ5X3ZhbHVlID0gY2FjaGVFbnRyeS52YWx1ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9jYWNoZUVudHJ5X3ZhbHVlLmtpbmQpICE9PSBDYWNoZWRSb3V0ZUtpbmQuQVBQX1JPVVRFKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9jYWNoZUVudHJ5X3ZhbHVlMTtcbiAgICAgICAgICAgICAgICB0aHJvdyBPYmplY3QuZGVmaW5lUHJvcGVydHkobmV3IEVycm9yKGBJbnZhcmlhbnQ6IGFwcC1yb3V0ZSByZWNlaXZlZCBpbnZhbGlkIGNhY2hlIGVudHJ5ICR7Y2FjaGVFbnRyeSA9PSBudWxsID8gdm9pZCAwIDogKF9jYWNoZUVudHJ5X3ZhbHVlMSA9IGNhY2hlRW50cnkudmFsdWUpID09IG51bGwgPyB2b2lkIDAgOiBfY2FjaGVFbnRyeV92YWx1ZTEua2luZH1gKSwgXCJfX05FWFRfRVJST1JfQ09ERVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkU3MDFcIixcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFnZXRSZXF1ZXN0TWV0YShyZXEsICdtaW5pbWFsTW9kZScpKSB7XG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlcigneC1uZXh0anMtY2FjaGUnLCBpc09uRGVtYW5kUmV2YWxpZGF0ZSA/ICdSRVZBTElEQVRFRCcgOiBjYWNoZUVudHJ5LmlzTWlzcyA/ICdNSVNTJyA6IGNhY2hlRW50cnkuaXNTdGFsZSA/ICdTVEFMRScgOiAnSElUJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBEcmFmdCBtb2RlIHNob3VsZCBuZXZlciBiZSBjYWNoZWRcbiAgICAgICAgICAgIGlmIChpc0RyYWZ0TW9kZSkge1xuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAncHJpdmF0ZSwgbm8tY2FjaGUsIG5vLXN0b3JlLCBtYXgtYWdlPTAsIG11c3QtcmV2YWxpZGF0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaGVhZGVycyA9IGZyb21Ob2RlT3V0Z29pbmdIdHRwSGVhZGVycyhjYWNoZUVudHJ5LnZhbHVlLmhlYWRlcnMpO1xuICAgICAgICAgICAgaWYgKCEoZ2V0UmVxdWVzdE1ldGEocmVxLCAnbWluaW1hbE1vZGUnKSAmJiBpc0lzcikpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzLmRlbGV0ZShORVhUX0NBQ0hFX1RBR1NfSEVBREVSKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIElmIGNhY2hlIGNvbnRyb2wgaXMgYWxyZWFkeSBzZXQgb24gdGhlIHJlc3BvbnNlIHdlIGRvbid0XG4gICAgICAgICAgICAvLyBvdmVycmlkZSBpdCB0byBhbGxvdyB1c2VycyB0byBjdXN0b21pemUgaXQgdmlhIG5leHQuY29uZmlnXG4gICAgICAgICAgICBpZiAoY2FjaGVFbnRyeS5jYWNoZUNvbnRyb2wgJiYgIXJlcy5nZXRIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnKSAmJiAhaGVhZGVycy5nZXQoJ0NhY2hlLUNvbnRyb2wnKSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuc2V0KCdDYWNoZS1Db250cm9sJywgZ2V0Q2FjaGVDb250cm9sSGVhZGVyKGNhY2hlRW50cnkuY2FjaGVDb250cm9sKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCBuZXcgUmVzcG9uc2UoY2FjaGVFbnRyeS52YWx1ZS5ib2R5LCB7XG4gICAgICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgICAgICBzdGF0dXM6IGNhY2hlRW50cnkudmFsdWUuc3RhdHVzIHx8IDIwMFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIC8vIFRPRE86IGFjdGl2ZVNwYW4gY29kZSBwYXRoIGlzIGZvciB3aGVuIHdyYXBwZWQgYnlcbiAgICAgICAgLy8gbmV4dC1zZXJ2ZXIgY2FuIGJlIHJlbW92ZWQgd2hlbiB0aGlzIGlzIG5vIGxvbmdlciB1c2VkXG4gICAgICAgIGlmIChhY3RpdmVTcGFuKSB7XG4gICAgICAgICAgICBhd2FpdCBoYW5kbGVSZXNwb25zZShhY3RpdmVTcGFuKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF3YWl0IHRyYWNlci53aXRoUHJvcGFnYXRlZENvbnRleHQocmVxLmhlYWRlcnMsICgpPT50cmFjZXIudHJhY2UoQmFzZVNlcnZlclNwYW4uaGFuZGxlUmVxdWVzdCwge1xuICAgICAgICAgICAgICAgICAgICBzcGFuTmFtZTogYCR7bWV0aG9kfSAke3JlcS51cmx9YCxcbiAgICAgICAgICAgICAgICAgICAga2luZDogU3BhbktpbmQuU0VSVkVSLFxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC5tZXRob2QnOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICAnaHR0cC50YXJnZXQnOiByZXEudXJsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBoYW5kbGVSZXNwb25zZSkpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGlmICghKGVyciBpbnN0YW5jZW9mIE5vRmFsbGJhY2tFcnJvcikpIHtcbiAgICAgICAgICAgIGF3YWl0IHJvdXRlTW9kdWxlLm9uUmVxdWVzdEVycm9yKHJlcSwgZXJyLCB7XG4gICAgICAgICAgICAgICAgcm91dGVyS2luZDogJ0FwcCBSb3V0ZXInLFxuICAgICAgICAgICAgICAgIHJvdXRlUGF0aDogbm9ybWFsaXplZFNyY1BhZ2UsXG4gICAgICAgICAgICAgICAgcm91dGVUeXBlOiAncm91dGUnLFxuICAgICAgICAgICAgICAgIHJldmFsaWRhdGVSZWFzb246IGdldFJldmFsaWRhdGVSZWFzb24oe1xuICAgICAgICAgICAgICAgICAgICBpc1JldmFsaWRhdGUsXG4gICAgICAgICAgICAgICAgICAgIGlzT25EZW1hbmRSZXZhbGlkYXRlXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldGhyb3cgc28gdGhhdCB3ZSBjYW4gaGFuZGxlIHNlcnZpbmcgZXJyb3IgcGFnZVxuICAgICAgICAvLyBJZiB0aGlzIGlzIGR1cmluZyBzdGF0aWMgZ2VuZXJhdGlvbiwgdGhyb3cgdGhlIGVycm9yIGFnYWluLlxuICAgICAgICBpZiAoaXNJc3IpIHRocm93IGVycjtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzZW5kIGEgNTAwIHJlc3BvbnNlLlxuICAgICAgICBhd2FpdCBzZW5kUmVzcG9uc2Uobm9kZU5leHRSZXEsIG5vZGVOZXh0UmVzLCBuZXcgUmVzcG9uc2UobnVsbCwge1xuICAgICAgICAgICAgc3RhdHVzOiA1MDBcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXBcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Frecords%2Froute&page=%2Fapi%2Frecords%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Frecords%2Froute.ts&appDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/server/app-render/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/action-async-storage.external.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "./work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "http2":
/*!************************!*\
  !*** external "http2" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("http2");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "next/dist/shared/lib/no-fallback-error.external":
/*!******************************************************************!*\
  !*** external "next/dist/shared/lib/no-fallback-error.external" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/no-fallback-error.external");

/***/ }),

/***/ "next/dist/shared/lib/router/utils/app-paths":
/*!**************************************************************!*\
  !*** external "next/dist/shared/lib/router/utils/app-paths" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/shared/lib/router/utils/app-paths");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:buffer");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs");

/***/ }),

/***/ "node:http":
/*!****************************!*\
  !*** external "node:http" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:http");

/***/ }),

/***/ "node:https":
/*!*****************************!*\
  !*** external "node:https" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:https");

/***/ }),

/***/ "node:net":
/*!***************************!*\
  !*** external "node:net" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:net");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ }),

/***/ "node:process":
/*!*******************************!*\
  !*** external "node:process" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:process");

/***/ }),

/***/ "node:stream":
/*!******************************!*\
  !*** external "node:stream" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream");

/***/ }),

/***/ "node:stream/web":
/*!**********************************!*\
  !*** external "node:stream/web" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:stream/web");

/***/ }),

/***/ "node:url":
/*!***************************!*\
  !*** external "node:url" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:url");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:util");

/***/ }),

/***/ "node:zlib":
/*!****************************!*\
  !*** external "node:zlib" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:zlib");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/googleapis","vendor-chunks/google-auth-library","vendor-chunks/googleapis-common","vendor-chunks/gcp-metadata","vendor-chunks/math-intrinsics","vendor-chunks/gaxios","vendor-chunks/es-errors","vendor-chunks/qs","vendor-chunks/jws","vendor-chunks/call-bind-apply-helpers","vendor-chunks/google-logging-utils","vendor-chunks/json-bigint","vendor-chunks/get-proto","vendor-chunks/object-inspect","vendor-chunks/has-symbols","vendor-chunks/gopd","vendor-chunks/function-bind","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/gtoken","vendor-chunks/url-template","vendor-chunks/side-channel","vendor-chunks/side-channel-weakmap","vendor-chunks/side-channel-map","vendor-chunks/side-channel-list","vendor-chunks/safe-buffer","vendor-chunks/jwa","vendor-chunks/hasown","vendor-chunks/get-intrinsic","vendor-chunks/extend","vendor-chunks/es-object-atoms","vendor-chunks/es-define-property","vendor-chunks/dunder-proto","vendor-chunks/call-bound","vendor-chunks/buffer-equal-constant-time","vendor-chunks/bignumber.js","vendor-chunks/base64-js"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Frecords%2Froute&page=%2Fapi%2Frecords%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Frecords%2Froute.ts&appDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fafifs%2FDocuments%2FBelajar-it%2FPhyton%2Fbelajar-data-science-main%2Fcourse&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D&isGlobalNotFoundEnabled=!")));
module.exports = __webpack_exports__;

})();