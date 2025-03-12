const TableOfContents = new Schema({
    // Thông tin định danh
    resource_type: {
        type: String,
        enum: ['collection', 'product', 'page', 'blog_post'],
        required: true
    }, // Loại tài nguyên
    resource_id: { type: String, required: true }, // ID của tài nguyên
    title: { type: String, default: '' }, // Tiêu đề Bảng mục lục
    alignment: { type: String, enum: ['left', 'center', 'right'], default: 'left' }, // Căn chỉnh tiêu đề
    indentation: { type: Boolean, default: false }, // Thụt lề cho tiêu đề
    numbering: { type: String, enum: ['numbers', 'none'], default: 'numbers' }, // Kiểu đánh số
    section_line: { type: Boolean, default: true }, // Hiển thị đường kẻ phân cách
    headings: { type: [String], default: ['h1', 'h2', 'h3'] }, // Các cấp tiêu đề
    position: {
        type: String,
        enum: ['above_first_heading', 'theme_editor', 'custom_class'],
        default: 'above_first_heading'
    }, // Vị trí Bảng mục lục
    custom_class_name: { type: String, default: '' }, // Lớp CSS tùy chỉnh
    // Cài đặt giao diện
    scroll_animation: { type: Boolean, default: false }, // Hiệu ứng cuộn
    scroll_offset: { type: Number, default: 0 }, // Độ lệch cuộn
    font_size_title: { type: Number, default: 14 }, // Cỡ chữ tiêu đề
    font_size_headings: { type: Number, default: 14 }, // Cỡ chữ tiêu đề bên trong
    padding_top: { type: Number, default: 16 }, // Padding trên
    padding_bottom: { type: Number, default: 0 }, // Padding dưới
    padding_left: { type: Number, default: 0 }, // Padding trái
    padding_right: { type: Number, default: 0 }, // Padding phải
    max_width: { type: Number, default: 0 }, // Chiều rộng tối đa
    display_alignment: { type: String, enum: ['center', 'left', 'right'], default: 'center' }, // Căn chỉnh hiển thị
    title_color: { type: String, default: '#000000' }, // Màu tiêu đề
    heading_color: { type: String, default: '#000000' }, // Màu tiêu đề bên trong
    hide_branding: { type: Boolean, default: true }, // Ẩn thương hiệu 
    custom_link_hover: { type: Boolean, default: false }, // Hiệu ứng hover cho link
    link_hover_style: { type: String, enum: ['underline', 'none'], default: 'none' }, // Kiểu hover link
    heading_id_generation: {
        type: String,
        enum: ['numbering', 'slug_by_title'],
        default: 'numbering'
    }, // Tạo ID tiêu đề phục vụ việc anchor link
    show_hide_button: { type: Boolean, default: true }, // Nút ẩn/hiện Bảng mục lục
    hide_button_name: { type: String, default: 'hide' }, // Nhãn nút ẩn
    show_button_name: { type: String, default: 'show' }, // Nhãn nút hiện
    initial_display_lines: { type: Number, default: null }, // Số dòng hiển thị ban đầu
    show_all_button_name: { type: String, default: 'show all' }, // Nhãn nút hiển thị tất cả


});
