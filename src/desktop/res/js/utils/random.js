export const getRandomID = () => {
    return `id_${Math.random().toString(36).substr(2, 9)}`;
};
