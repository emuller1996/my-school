export const menuItems = [
    {
        id: 'Dashboard',
        label: 'Dashboard',
        icon: 'fa-solid fa-house',
        href: '#',
        to:"/"
    },
    {
        id: 'academico',
        label: 'Académico',
        icon: 'fa-solid fa-graduation-cap',
        children: [
            { id: 'students', label: 'Estudiantes', to:"students",  icon: 'fa-solid fa-user-graduate' },
            { id: 'teachers', label: 'Profesores', to:"teachers", icon: 'fa-solid fa-chalkboard-user' },
            { id: 'enrollments', label: 'Matrículas', to:"enrollments", icon: 'fa-solid fa-file-signature' },
            { id: 'class-groups', label: 'Grupos de clase', to:"class-groups", icon: 'fa-solid fa-people-group' },
            { id: 'classrooms', label: 'Salones', to:"classrooms", icon: 'fa-solid fa-door-open' },
        ],
    },
    {
        id: 'inicio',
        label: 'Inicio',
        icon: 'fa-solid fa-house',
        href: '#',
    },
    {
        id: 'calificaciones',
        label: 'Calificaciones',
        icon: 'fa-solid fa-clipboard-list',
        href: '#',
    },
    {
        id: 'horarios',
        label: 'Horarios',
        icon: 'fa-solid fa-calendar-days',
        href: '#',
    },
];