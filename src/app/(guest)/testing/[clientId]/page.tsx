"use client";
const GuestTestingPage = ({ params }: { params: { clientId: string } }) => {
  console.log(params.clientId);
  return (
    <div>
      <h1>Guest Testing Page {params.clientId}</h1>
    </div>
  );
};

export default GuestTestingPage;
