"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.fetchAdminProducts = exports.adminProductApi = void 0;

var _axiosConfig = _interopRequireDefault(require("./axiosConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 관리자 상품 API
var adminProductApi = {
  // 상품 생성
  createProduct: function createProduct(productData) {
    var response;
    return regeneratorRuntime.async(function createProduct$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].post("/api/admin/products", productData));

          case 3:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // 상품 수정
  updateProduct: function updateProduct(productId, productData) {
    var response;
    return regeneratorRuntime.async(function updateProduct$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"].put("/api/admin/products/".concat(productId), productData));

          case 3:
            response = _context2.sent;
            return _context2.abrupt("return", response.data);

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            throw _context2.t0;

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  },
  // 상품 삭제
  deleteProduct: function deleteProduct(productId) {
    var response;
    return regeneratorRuntime.async(function deleteProduct$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(_axiosConfig["default"]["delete"]("/api/admin/products/".concat(productId)));

          case 3:
            response = _context3.sent;
            return _context3.abrupt("return", response.data);

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            throw _context3.t0;

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 7]]);
  }
}; // 개별 함수로도 export (기존 코드 호환성)

exports.adminProductApi = adminProductApi;
var fetchAdminProducts = adminProductApi.getProducts;
exports.fetchAdminProducts = fetchAdminProducts;
var createProduct = adminProductApi.createProduct;
exports.createProduct = createProduct;
var updateProduct = adminProductApi.updateProduct;
exports.updateProduct = updateProduct;
var deleteProduct = adminProductApi.deleteProduct;
exports.deleteProduct = deleteProduct;