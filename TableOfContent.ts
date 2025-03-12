const TableOfContents = new Schema({
    titleSettings: {
        content: { type: String, default: '' }, // Tiêu đề Bảng mục lục
        alignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' }, // Căn chỉnh tiêu đề
        fontSizeTitle: { type: Number, default: 14 }, // Cỡ chữ tiêu đề
        titleColor: { type: String, default: '#000000' } // Màu tiêu đề
    },

    headingSettings: {
        headings: { type: [String], default: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }, // Các cấp tiêu đề
        numbering: { type: String, enum: ['numbers', 'none'], default: 'numbers' }, // Kiểu đánh số
        sectionLine: { type: Boolean, default: true }, // Hiển thị đường kẻ phân cách
        indentation: { type: Boolean, default: false }, // Thụt lề cho tiêu đề
        fontSizeHeadings: { type: Number, default: 14 }, // Cỡ chữ tiêu đề bên trong
        headingColor: { type: String, default: '#000000' }, // Màu tiêu đề bên trong
        headingIdGeneration: {
            type: String,
            enum: ['numbering', 'slugByTitle'],
            default: 'numbering'
        }, // Tạo ID tiêu đề phục vụ việc anchor link
        padding: {
            top: { type: Number, default: 0 },
            bottom: { type: Number, default: 0 },
            left: { type: Number, default: 0 },
            right: { type: Number, default: 0 }
        }
    },

    positionSettings: {
        position: {
            type: String,
            enum: ['aboveFirstHeading', 'themeEditor', 'customClass'],
            default: 'aboveFirstHeading'
        }, // Vị trí Bảng mục lục
        customClassName: { type: String, default: '' } // Lớp CSS tùy chỉnh
    },

    appearanceSettings: {
        scrollAnimation: { type: Boolean, default: false }, // Hiệu ứng cuộn
        scrollOffset: { type: Number, default: 0 }, // Độ lệch cuộn
        padding: {
            top: { type: Number, default: 16 },
            bottom: { type: Number, default: 0 },
            left: { type: Number, default: 0 },
            right: { type: Number, default: 0 }
        },
        maxWidth: { type: Number, default: 0 }, // Chiều rộng tối đa
        displayAlignment: { type: String, enum: ['center', 'left', 'right'], default: 'center' } // Căn chỉnh hiển thị
    },

    buttonSettings: {
        showHideButton: { type: Boolean, default: true }, // Nút ẩn/hiện Bảng mục lục
        hideButtonName: { type: String, default: 'hide' }, // Nhãn nút ẩn
        showButtonName: { type: String, default: 'show' }, // Nhãn nút hiện
        initialDisplayLines: { type: Number, default: null }, // Số dòng hiển thị ban đầu
        showAllButtonName: { type: String, default: 'show all' } // Nhãn nút hiển thị tất cả
    },

    linkSettings: {
        customLinkHover: { type: Boolean, default: false }, // Hiệu ứng hover cho link
        linkHoverStyle: { type: String, enum: ['underline', 'none'], default: 'none' }, // Kiểu hover link
        hideBranding: { type: Boolean, default: true } // Ẩn thương hiệu
    }
});
