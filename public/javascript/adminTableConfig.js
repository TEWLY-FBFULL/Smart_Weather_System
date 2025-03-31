// Format Date
const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16).replace('T', ' ');
};
// Format Date Only
function formatDateOnly(isoString) {
    return isoString.split('T')[0];
}
//  Edit and Delete
const actionButtons = (id) => `
    <td><button class="btn edit-btn" data-id="${id}">Edit</button></td>
    <td><button class="btn delete-btn" data-id="${id}">Delete</button></td>
`;
// Table Configurations
const tableConfig = {
    roles: {
        columns: ["ID", "Role", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.role_id}</td>
            <td>${data.role_name}</td>
            <td>${formatDate(data.role_created_at)}</td>
            ${actionButtons(data.role_id)}
        `,
    },
    users: {
        columns: ["ID", "Name", "Email", "Role", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.user_id}</td>
            <td>${data.user_name}</td>
            <td>${data.email}</td>
            <td>${data.role_name}</td>
            <td>${formatDate(data.user_created_at)}</td>
            ${actionButtons(data.user_id)}
        `,
    },
    admin_logs: {
        columns: ["Name", "Role", "Action", "Created At"],
        renderRow: (data) => `
            <td>${data.user_name}</td>
            <td>${data.role_name}</td>
            <td>${data.action}</td>
            <td>${formatDate(data.log_created_at)}</td>
        `,
    },
    youtube_videos: {
        columns: ["City Name", "Keyword", "Title", "Channel", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.city_name_th}</td>
            <td>${data.keyw_name}</td>
            <td>${data.title}</td>
            <td>${data.channel_title}</td>
            <td>${formatDate(data.yt_created_at)}</td>
            ${actionButtons(data.video_id)}
        `,
    },
    keywords: {
        columns: ["ID", "Keyword", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.keyw_id}</td>
            <td>${data.keyw_name}</td>
            <td>${formatDate(data.keyw_created_at)}</td>
            ${actionButtons(data.keyw_id)}
        `,
    },
    cities: {
        columns: ["ID", "City Name", "Longitude", "Latitude", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.city_id}</td>
            <td>${data.city_name_th} / ${data.city_name_en}</td>
            <td>${data.lon}</td>
            <td>${data.lat}</td>
            ${actionButtons(data.city_id)}
        `,
    },
    weather_reports: {
        columns: ["City Name", "Weather Description", "Temp", "Humidity", "Wind Speed", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.city_name_th}</td>
            <td>${data.weather_desc_th}</td>
            <td>${data.rep_temp} °C</td>
            <td>${data.rep_humidity} %</td>
            <td>${data.rep_wind_speed} m/s</td>
            <td>${formatDate(data.report_created_at)}</td>
            ${actionButtons(data.report_id)}
        `,
    },
    weather_forecasts: {
        columns: ["City Name", "Weather Description", "Temp", "Humidity", "Wind Speed", "Forecast Date", "Forecast Time", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.city_name_th}</td>
            <td>${data.weather_desc_th}</td>
            <td>${data.fore_temp} °C</td>
            <td>${data.fore_humidity} %</td>
            <td>${data.fore_wind_speed} m/s</td>
            <td>${formatDateOnly(data.forecast_date)}</td>
            <td>${data.forecast_time}</td>
            ${actionButtons(data.forecast_id)}
        `,
    },
    weather_description: {
        columns: ["ID", "Description (TH)", "Description (EN)", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.wedesc_id}</td>
            <td>${data.weather_desc_th}</td>
            <td>${data.weather_desc_en}</td>
            <td>${formatDate(data.wedesc_created_at)}</td>
            ${actionButtons(data.wedesc_id)}
        `,
    },
    user_posts: {
        columns: ["Name", "City Name", "Post", "Created At", "Edit", "Delete"],
        renderRow: (data) => `
            <td>${data.user_name}</td>
            <td>${data.city_name_th}</td>
            <td>${data.post_text}</td>
            <td>${formatDate(data.post_created_at)}</td>
            ${actionButtons(data.post_id)}
        `,
    },
    weather_analysis_results: {
        columns: ["Description", "Source Type", "Youtube", "User Post", "Similarity", "Created At"],
        renderRow: (data) => `
            <td>${data.weather_description}</td>
            <td>${data.source_type}</td>
            <td>${data.youtube_title}</td>
            <td>${data.user_post_text}</td>
            <td>${data.similarity}</td>
            <td>${formatDate(data.analy_created_at)}</td>
        `,
    },
}; 

export { tableConfig };