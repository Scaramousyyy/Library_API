export const ConnectOrCreate = (names, relationModelName) => {
  if (!names || names.length === 0) {
    return [];
  }

  return names.map((name) => {
    const trimmedName = name.trim();
    return {
      [relationModelName]: {
        connectOrCreate: {
          where: { name: trimmedName },
          create: { name: trimmedName },
        },
      },
    };
  });
};